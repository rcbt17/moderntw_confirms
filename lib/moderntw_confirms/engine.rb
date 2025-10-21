module ModerntwConfirms
  class Engine < ::Rails::Engine
    isolate_namespace ModerntwConfirms

    initializer "moderntw_confirms.assets" do |app|
      app.config.assets.paths << root.join("vendor", "assets", "javascripts")
      app.config.assets.precompile += %w( moderntw_confirms.js )
    end

    initializer "moderntw_confirms.importmap", before: "importmap" do |app|
      if defined?(Importmap)
        app.config.importmap.paths << Engine.root.join("config/importmap.rb")
      end
    end
  end
end