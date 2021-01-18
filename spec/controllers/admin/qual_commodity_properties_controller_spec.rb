require 'rails_helper'

RSpec.describe Admin::QualCommodityPropertiesController, type: :controller do
  render_views

  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe 'POST create' do
    let(:qual) { FactoryBot.create(:api_v3_qual) }
    let(:qual_2) { FactoryBot.create(:api_v3_qual) }

    let(:commodity) { FactoryBot.create(:api_v3_commodity) }
    let(:commodity_2) { FactoryBot.create(:api_v3_commodity) }

    let(:tooltip_text) { 'Tooltip text' }
    let(:display_name) { 'Display name' }

    let(:old_valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_qual_commodity_property,
        qual_id: qual_2.id,
        commodity_id: commodity_2.id,
        tooltip_text: tooltip_text,
        display_name: display_name
      )
    }

    let(:new_valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_qual_commodity_property,
        qual_id: qual.id,
        commodity_id: commodity.id,
        tooltip_text: tooltip_text,
        display_name: display_name
      )
    }

    let!(:qual_commodity_property) {
      FactoryBot.create(:api_v3_qual_commodity_property, old_valid_attributes)
    }

    let(:duplicate) { old_valid_attributes }

    let(:no_qual_provided) { new_valid_attributes.except(:qual_id) }

    let(:no_commodity_provided) { new_valid_attributes.except(:commodity_id) }

    let(:no_tooltip_provided) { new_valid_attributes.except(:tooltip_text) }

    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_qual_commodity_property: new_valid_attributes}
    end

    def 'is successful when valid attributes' do
      post :create, params: {api_v3_qual_commodity_property: new_valid_attributes}
      expect(response).not_to render_template(:new)
    end

    it 'fails if qual is not provided' do
      post :create, params: {api_v3_qual_commodity_property: no_qual_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if commodity is not provided' do
      post :create, params: {api_v3_qual_commodity_property: no_commodity_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if tooltip is not provided' do
      post :create, params: {api_v3_qual_commodity_property: no_tooltip_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if property with commodity and qual are already coupled' do
      post :create, params: {api_v3_qual_commodity_property: duplicate}
      expect(response).to render_template(:new)
    end

    it 'renders index' do
      get :index
      expect(response).to render_template(:index)
    end

    it 'renders show' do
      get :show, params: {id: qual_commodity_property.id}
      expect(response).to render_template(:show)
    end
  end
end
