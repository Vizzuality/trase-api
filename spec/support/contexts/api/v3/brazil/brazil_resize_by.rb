shared_context 'api v3 brazil resize by' do
  include_context 'api v3 brazil contexts'
  include_context 'api v3 quants'

  let!(:api_v3_area_resize_by_attribute) do
    resize_by_attribute = Api::V3::ResizeByQuant.
      includes(:resize_by_attribute).
      where(
        'resize_by_attributes.context_id' => api_v3_context.id,
        quant_id: api_v3_area.id
      ).first&.resize_by_attribute
    unless resize_by_attribute
      resize_by_attribute = FactoryBot.create(
        :api_v3_resize_by_attribute,
        tooltip_text: 'area tooltip text',
        context: api_v3_context,
        position: 1,
        years: [],
        group_number: 1,
        is_disabled: false,
        is_default: false
      )
      FactoryBot.create(
        :api_v3_resize_by_quant,
        resize_by_attribute: resize_by_attribute,
        quant: api_v3_area
      )
    end
    resize_by_attribute
  end

  let!(:api_v3_land_conflict_resize_by_attribute) do
    resize_by_attribute = Api::V3::ResizeByQuant.
      includes(:resize_by_attribute).
      where(
        'resize_by_attributes.context_id' => api_v3_context.id,
        quant_id: api_v3_land_conflicts.id
      ).first&.resize_by_attribute
    unless resize_by_attribute
      resize_by_attribute = FactoryBot.create(
        :api_v3_resize_by_attribute,
        tooltip_text: 'land conflict tooltip text',
        context: api_v3_context,
        position: 2,
        years: [],
        group_number: 1,
        is_disabled: false,
        is_default: false
      )
      FactoryBot.create(
        :api_v3_resize_by_quant,
        resize_by_attribute: resize_by_attribute,
        quant: api_v3_land_conflicts
      )
    end
    resize_by_attribute
  end
end
