# frozen_string_literal: true

require_relative "lib/moderntw_confirms/version"

Gem::Specification.new do |spec|
  spec.name = "moderntw_confirms"
  spec.version = ModerntwConfirms::VERSION
  spec.authors = ["Robin Ciubotaru"]
  spec.email = ["robinciubotaru17@gmail.com"]

  spec.summary = "Replace browser confirm dialogs with modern Tailwind CSS modals in Rails"
  spec.description = "Automatically intercepts Rails data-confirm and data-turbo-confirm attributes, replacing native browser dialogs with customizable Tailwind CSS modals"
  spec.homepage = "https://github.com/rcbt17/moderntw_confirms"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.0.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/rcbt17/moderntw_confirms"
  spec.metadata["changelog_uri"] = "https://github.com/rcbt17/moderntw_confirms/blob/main/CHANGELOG.md"

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  gemspec = File.basename(__FILE__)
  spec.files = IO.popen(%w[git ls-files -z], chdir: __dir__, err: IO::NULL) do |ls|
    ls.readlines("\x0", chomp: true).reject do |f|
      (f == gemspec) ||
        (f == "demo.gif") ||
        f.start_with?(*%w[bin/ test/ spec/ features/ .git .github appveyor Gemfile])
    end
  end
  spec.bindir = "exe"
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "rails", ">= 6.1"
  spec.add_development_dependency "sqlite3"
  spec.add_development_dependency "puma"
end
