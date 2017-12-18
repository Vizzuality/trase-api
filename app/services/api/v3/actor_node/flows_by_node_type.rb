module Api
  module V3
    module ActorNode
      class FlowsByNodeType
        def initialize(context, year, node_type_name)
          @context = context
          @year = year
          @node_type_name = node_type_name
          @node_index = NodeType.node_index_for_name(@context, node_type_name)
        end

        def nodes_with_flows_count(attribute)
          Node.from(
            '(' + nodes_with_flows(attribute).to_sql + ') s'
          ).count
        end

        def nodes_with_flows_into_node_count(attribute, node)
          node_index = NodeType.node_index_for_id(@context, node.node_type_id)
          Node.from(
            '(' +
            nodes_with_flows(attribute).
              where('flows.path[?] = ?', node_index, node.id).to_sql +
            ') s'
          ).count
        end

        def nodes_with_flows_into_node_by_year(attribute, node)
          attribute_type = attribute.class.name.demodulize.downcase
          flow_values = :"flow_#{attribute_type}s"
          node_index = NodeType.node_index_for_id(@context, node.node_type_id)

          top_nodes = Api::V3::PlaceNode::TopNodesList.new(
            @context, @year, node, other_node_type_name: @node_type_name
          ).unsorted_list(attribute, false, nil)

          select_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              "year, flows.path[?] AS node_id, SUM(#{flow_values}.value::DOUBLE PRECISION) AS value, nodes.name AS name",
              @node_index
            ]
          )
          nodes_join_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              'JOIN nodes ON nodes.id = flows.path[?] AND nodes.id IN (?)',
              @node_index, top_nodes.map { |n| n['node_id'] }
            ]
          )
          group_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['flows.path[?], nodes.name, year', @node_index]
          )

          nodes_with_flows_all_years(attribute).
            except(:select).
            except(:group).
            select(select_clause).
            joins(nodes_join_clause).
            group(group_clause).
            where('flows.path[?] = ?', node_index, node.id)
        end

        def nodes_with_flows_totals(attribute)
          nodes_with_flows_totals_for_attributes([attribute])
        end

        def nodes_with_flows_totals_for_attributes(attributes)
          attributes_ids = attributes.map(&:id)
          attribute_type = attributes.first&.class&.name&.demodulize&.downcase
          flow_values = :"flow_#{attribute_type}s"
          nodes_join_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              'JOIN nodes ON nodes.id = flows.path[?]', @node_index
            ]
          )
          Flow.
            select(
              "nodes.id AS node_id, nodes.name, \
SUM(#{flow_values}.value::DOUBLE PRECISION) AS value, \
#{attribute_type}s.name AS attribute_name"
            ).
            joins(nodes_join_clause).
            joins('JOIN node_properties ON nodes.id = node_properties.node_id').
            joins(flow_values => attribute_type).
            where('flows.context_id' => @context.id).
            where("#{flow_values}.#{attribute_type}_id" => attributes_ids).
            where('flows.year' => @year).
            where('NOT nodes.is_unknown').
            where('NOT node_properties.is_domestic_consumption').
            group("nodes.id, nodes.name, #{attribute_type}s.name")
        end

        private

        def nodes_with_flows_all_years(attribute)
          attribute_type = attribute.class.name.demodulize.downcase
          flow_values = :"flow_#{attribute_type}s"
          select_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['flows.path[?] AS node_id', @node_index]
          )
          group_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['flows.path[?]', @node_index]
          )
          Flow.
            select(select_clause).
            joins(flow_values).
            where("#{flow_values}.#{attribute_type}_id" => attribute.id).
            where(context_id: @context.id).
            group(group_clause)
        end

        def nodes_with_flows(attribute)
          nodes_with_flows_all_years(attribute).where(year: @year)
        end
      end
    end
  end
end
