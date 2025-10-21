require "rails/generators"

module ModerntwConfirms
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("templates", __dir__)

      desc "Install ModerntwConfirms and configure your application"

      def install_javascript
        if using_importmap?
          install_with_importmap
        elsif using_webpacker?
          install_with_webpacker
        else
          install_with_asset_pipeline
        end
      end

      def copy_modal_partial
        say "Copying modal partial", :green
        copy_file "_moderntw_confirms_modal.html.erb", "app/views/shared/_moderntw_confirms_modal.html.erb"
      end

      def add_modal_to_layout
        say "Adding modal to application layout", :green

        layout_file = "app/views/layouts/application.html.erb"
        if File.exist?(Rails.root.join(layout_file))
          insert_into_file layout_file, before: "</body>" do
            "\n    <%= render 'shared/moderntw_confirms_modal' %>\n  "
          end
        else
          say "Please add <%= render 'shared/moderntw_confirms_modal' %> before </body> in your layout", :yellow
        end
      end

      def add_stimulus_controller
        if using_stimulus?
          say "Adding Stimulus controller for ModerntwConfirms", :green
          append_to_file "app/javascript/controllers/index.js" do
            <<~JS

              import ConfirmModalController from "moderntw_confirms/confirm_modal_controller"
              application.register("moderntw-confirms", ConfirmModalController)
            JS
          end
        end
      end

      def create_initializer
        template "moderntw_confirms.rb", "config/initializers/moderntw_confirms.rb"
      end

      def display_post_install_message
        say "\n  ModerntwConfirms has been installed successfully! 🎉", :green
        say "\n  Next steps:", :yellow
        say "  1. Make sure Tailwind CSS is installed and configured in your app"
        say "  2. Restart your Rails server"
        say "  3. All your data-confirm attributes will now use beautiful modals!"
        say "\n  Configuration:", :yellow
        say "  Edit config/initializers/moderntw_confirms.rb to customize modal styles"
        say "\n  Usage:", :yellow
        say "  Just use data-confirm as usual:"
        say '  <%= link_to "Delete", item_path(@item), method: :delete, data: { confirm: "Are you sure?" } %>'
        say "\n"
      end

      private

      def using_importmap?
        Rails.root.join("config", "importmap.rb").exist?
      end

      def using_webpacker?
        defined?(Webpacker)
      end

      def using_stimulus?
        Rails.root.join("app", "javascript", "controllers").exist?
      end

      def install_with_importmap
        say "Installing ModerntwConfirms with importmap", :green
        append_to_file "config/importmap.rb" do
          <<~RUBY

            # ModerntwConfirms
            pin "moderntw_confirms", to: "moderntw_confirms.js"
            pin "moderntw_confirms/confirm_modal_controller", to: "moderntw_confirms/confirm_modal_controller.js"
          RUBY
        end

        append_to_file "app/javascript/application.js" do
          <<~JS

            // ModerntwConfirms - Replace browser confirms with Tailwind modals
            import "moderntw_confirms"
          JS
        end
      end

      def install_with_webpacker
        say "Installing ModerntwConfirms with Webpacker", :green
        append_to_file "app/javascript/packs/application.js" do
          <<~JS

            // ModerntwConfirms - Replace browser confirms with Tailwind modals
            require("moderntw_confirms")
          JS
        end
      end

      def install_with_asset_pipeline
        say "Installing ModerntwConfirms with Asset Pipeline", :green
        append_to_file "app/assets/javascripts/application.js" do
          <<~JS

            //= require moderntw_confirms
          JS
        end
      end
    end
  end
end