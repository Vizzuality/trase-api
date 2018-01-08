shared_context 'api v3 brazil context layers' do
  include_context 'api v3 brazil contexts'
  include_context 'api v3 inds'
  include_context 'api v3 quants'

  let!(:api_v3_map_attribute_group1) do
    Api::V3::MapAttributeGroup.where(
      context_id: api_v3_context.id, position: 1
    ).first ||
      FactoryBot.create(
        :api_v3_map_attribute_group,
        context_id: api_v3_context.id,
        name: 'Context layer group one',
        position: 1
      )
  end

  let!(:api_v3_map_attribute_group2) do
    Api::V3::MapAttributeGroup.where(
      context_id: api_v3_context.id, position: 2
    ).first ||
      FactoryBot.create(
        :api_v3_map_attribute_group,
        context_id: api_v3_context.id,
        name: 'Context layer group two',
        position: 2
      )
  end

  let!(:api_v3_water_scarcity_map_attribute) do
    map_attribute = Api::V3::MapInd.
      includes(:map_attribute).
      where(
        'map_attributes.map_attribute_group_id' => api_v3_map_attribute_group1.id,
        ind_id: api_v3_water_scarcity.id
      ).first&.map_attribute
    unless map_attribute
      map_attribute = FactoryBot.create(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group1,
        position: 8,
        bucket_3: [4,6],
        bucket_5: [3,4,5,6],
        color_scale: 'bluered'
      )
      FactoryBot.create(
        :api_v3_map_ind,
        map_attribute: map_attribute,
        ind: api_v3_water_scarcity
      )
    end
    map_attribute
  end

  let!(:api_v3_gdp_per_capita_map_attribute) do
    map_attribute = Api::V3::MapInd.
      includes(:map_attribute).
      where(
        'map_attributes.map_attribute_group_id' => api_v3_map_attribute_group2.id,
        ind_id: api_v3_gdp_per_capita.id
      ).first&.map_attribute
    unless map_attribute
      map_attribute = FactoryBot.create(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group2,
        position: 17,
        bucket_3: [10000,50000],
        bucket_5: [10000,20000,50000,100000],
        color_scale: 'blue'
      )
      FactoryBot.create(
        :api_v3_map_ind,
        map_attribute: map_attribute,
        ind: api_v3_gdp_per_capita
      )
    end
    map_attribute
  end

  let!(:api_v3_land_conflicts_map_attribute) do
    map_attribute = Api::V3::MapQuant.
      includes(:map_attribute).
      where(
        'map_attributes.map_attribute_group_id' => api_v3_map_attribute_group1.id,
        quant_id: api_v3_land_conflicts.id
      ).first&.map_attribute
    unless map_attribute
      map_attribute = FactoryBot.create(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group1,
        position: 21,
        bucket_3: [6,15],
        bucket_5: [1,3,7,15],
        color_scale: 'red'
      )
      FactoryBot.create(
        :api_v3_map_quant,
        map_attribute: map_attribute,
        quant: api_v3_land_conflicts
      )
    end
    map_attribute
  end

  let!(:api_v3_force_labour_map_attribute) do
    map_attribute = Api::V3::MapQuant.
      includes(:map_attribute).
      where(
        'map_attributes.map_attribute_group_id' => api_v3_map_attribute_group2.id,
        quant_id: api_v3_force_labour.id
      ).first&.map_attribute
    unless map_attribute
      map_attribute = FactoryBot.create(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group2,
        position: 20,
        bucket_3: [2,5],
        bucket_5: [1,2,4,5],
        color_scale: 'red'
      )
      FactoryBot.create(
        :api_v3_map_quant,
        map_attribute: map_attribute,
        quant: api_v3_force_labour
      )
    end
    map_attribute
  end
end
