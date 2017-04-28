class TopVolumeNodes

  def initialize(context, node, node_type)
    @context = context
    @node = node
    @node_type = node_type
    @node_index = node_index(@node_type)
  end

  def top_volume_nodes
    top_nodes_for_quant('Volume')
  end

  def top_deforestation_nodes
    top_nodes_for_quant('DEFORESTATION')
  end

  def top_volume_nodes_by_year
    select_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["year, flows.path[?] AS node_id, sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, nodes.name AS name",
      @node_index]
    )
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?] AND node_id IN (?)",
      @node_index, top_volume_nodes.map(&:node_id)]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], nodes.name, year",
      @node_index]
    )
    values_per_year = Flow.select(select_clause).
      joins('LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id').
      joins('LEFT JOIN quants ON quants.quant_id = flow_quants.quant_id').
      joins(nodes_join_clause).
      where('flows.context_id' => @context.id).
      where('? = ANY(path)', @node.id).
      where('quants.name' => 'Volume').
      group(group_clause)
  end

  def years
    top_volume_nodes_by_year.distinct.pluck(:year)
  end

  def node_totals_for_quants(other_node_id, other_node_type, quant_names)
    other_node_index = node_index(other_node_type)
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?]",
      other_node_index]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], quants.name",
      other_node_index]
    )
    Flow.select('sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, quants.name').
      joins('LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id').
      joins('LEFT JOIN quants ON quants.quant_id = flow_quants.quant_id').
      joins(nodes_join_clause).
      where('nodes.name NOT LIKE ?', 'UNKNOWN%').
      where('flows.context_id' => @context.id).
      where('? = ANY(path) AND ? = ANY(path)', @node.id, other_node_id).
      where('quants.name' => quant_names).
      where(year: @context.default_year).
      group(group_clause)
  end

  private

  def top_nodes_for_quant(quant_name)
    select_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?] AS node_id, sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, nodes.name AS name, nodes.geo_id",
      @node_index]
    )
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?]",
      @node_index]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], nodes.name, nodes.geo_id",
      @node_index]
    )
    Flow.select(select_clause).
      joins('LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id').
      joins('LEFT JOIN quants ON quants.quant_id = flow_quants.quant_id').
      joins(nodes_join_clause).
      where('nodes.name NOT LIKE ?', 'UNKNOWN%').
      where('flows.context_id' => @context.id).
      where('? = ANY(path)', @node.id).
      where('quants.name' => quant_name).
      where(year: @context.default_year).
      group(group_clause).
      order('value DESC').
      limit(10)
  end

  def node_index(node_type)
    ContextNode.joins(:node_type).
      where(context_id: @context.id).
      where('node_types.node_type' => node_type).
      pluck(:column_position).first + 1
  end
end
