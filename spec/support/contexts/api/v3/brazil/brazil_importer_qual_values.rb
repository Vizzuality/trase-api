shared_context 'api v3 brazil importer qual values' do
  include_context 'api v3 quals'
  include_context 'api v3 brazil soy nodes'

  let!(:api_v3_zero_deforestation_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_importer1_node,
      qual: api_v3_zero_deforestation,
      value: 'NO'
    )
  end

  let!(:api_v3_zero_deforestation_link_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_importer1_node,
      qual: api_v3_zero_deforestation_link,
      value: 'HTTP://WWW.BUNGE.COM/CITIZENSHIP/SUSTAINABLE.HTML'
    )
  end

  let!(:api_v3_supply_change_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_importer1_node,
      qual: api_v3_supply_change,
      value: 'NO'
    )
  end

  let!(:api_v3_supply_change_link_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_importer1_node,
      qual: api_v3_supply_change_link,
      value: 'HTTP://SUPPLY-CHANGE.ORG/COMPANY/BUNGE'
    )
  end

  let!(:api_v3_rtrs_member_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_importer1_node,
      qual: api_v3_rtrs_member,
      value: 'NO'
    )
  end
end
