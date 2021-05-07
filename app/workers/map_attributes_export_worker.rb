class MapAttributesExportWorker
  include Sidekiq::Worker

  sidekiq_options queue: :low,
                  retry: 10,
                  backtrace: true

  def perform
    Api::V3::MapAttributesExport.new.call
  end
end
