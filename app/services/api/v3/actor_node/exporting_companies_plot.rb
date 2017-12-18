module Api
  module V3
    module ActorNode
      class ExportingCompaniesPlot
        include Profiles::AttributesInitializer

        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
          initialize_attributes(attributes_list)
        end

        def call
          unit = @volume_attribute.unit
          value_divisor = 1
          if unit.casecmp('tn').zero?
            unit = 'Kiloton'
            value_divisor = 1000
          end

          stats = FlowsByNodeType.new(@context, @year, @node.node_type.name)
          production_totals = stats.nodes_with_flows_totals(@volume_attribute)
          attribute_totals = stats.nodes_with_flows_totals_for_attributes(
            @attributes.map { |attribute_hash| attribute_hash[:attribute] }
          )

          attribute_indexes = Hash[
            @attributes.map.each_with_index do |attribute_hash, idx|
              [attribute_hash[:attribute_name], idx]
            end
          ]

          attribute_totals_hash = {}
          production_totals.each do |total|
            attribute_totals_hash[total['node_id']] ||= Array.new(
              @attributes.size
            )
          end
          attribute_totals.each do |total|
            attribute_idx = attribute_indexes[total['attribute_name']]
            if attribute_totals_hash.key?(total['node_id'])
              attribute_totals_hash[total['node_id']][attribute_idx] = total['value']
            end
          end

          exports = production_totals.map do |total|
            {
              name: total['name'],
              id: total['node_id'],
              y: total['value'].to_f / value_divisor,
              x: attribute_totals_hash[total['node_id']]
            }
          end

          {
            companies_sourcing: {
              dimension_y: {
                name: 'Trade Volume', unit: unit
              },
              dimensions_x: @attributes.map do |attribute_hash|
                attribute_hash.slice(:name, :unit)
              end,
              companies: exports
            }
          }
        end

        private

        def attributes_list
          [
            {
              name: 'Land use',
              unit: 'Ha',
              attribute_type: 'quant',
              attribute_name: 'LAND_USE'
            },
            {
              name: 'Territorial Deforestation',
              unit: 'Ha',
              attribute_type: 'quant',
              attribute_name: 'DEFORESTATION_V2'
            },
            {
              name: 'Maximum soy deforestation',
              unit: 'Ha',
              attribute_type: 'quant',
              attribute_name: 'POTENTIAL_SOY_DEFORESTATION_V2'
            },
            {
              name: 'Soy related deforestation',
              unit: 'Ha',
              attribute_type: 'quant',
              attribute_name: 'AGROSATELITE_SOY_DEFOR_'
            },
            {
              name: 'Loss of biodiversity',
              attribute_type: 'quant',
              attribute_name: 'BIODIVERSITY'
            },
            {
              name: 'Land-based emissions',
              unit: 'Tn',
              attribute_type: 'quant',
              attribute_name: 'GHG_'
            }
          ]
        end
      end
    end
  end
end
