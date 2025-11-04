# frozen_string_literal: true

require_relative "moderntw_confirms/version"
require_relative "moderntw_confirms/engine" if defined?(Rails)

module ModerntwConfirms
  class Error < StandardError; end

  class Configuration
    attr_accessor :backdrop_class, :modal_class, :confirm_button_class,
                  :cancel_button_class, :enable_on_mobile

    def initialize
      @backdrop_class = "bg-black bg-opacity-50"
      @modal_class = "bg-white rounded-lg shadow-xl"
      @confirm_button_class = "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      @cancel_button_class = "bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
      @enable_on_mobile = false
    end
  end

  class << self
    attr_writer :configuration

    def configuration
      @configuration ||= Configuration.new
    end

    def configure
      yield configuration
    end

    # Alias for backwards compatibility
    alias_method :config, :configuration
  end
end
