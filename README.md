# ModernTW Confirms

Beautiful Tailwind CSS confirmation modals for Rails applications. Drop-in replacement for browser confirmation dialogs.

[![Gem Version](https://badge.fury.io/rb/moderntw_confirms.svg)](https://badge.fury.io/rb/moderntw_confirms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Zero Configuration** - Works with your existing Rails code immediately
- **Beautiful Design** - Tailwind CSS powered modals with smooth animations
- **Smart Detection** - Automatically styles destructive actions in red
- **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- **Turbo Ready** - Full support for Rails 7+ Turbo and Turbo Streams
- **Accessible** - Keyboard navigation, focus management, and ARIA labels
- **Production Ready** - Error boundaries with automatic fallback to native confirms
- **Customizable** - Easy to modify styles to match your design system

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'moderntw_confirms'
```

And then execute:

```bash
bundle install
```

Run the installation generator:

```bash
rails generate moderntw_confirms:install
```

This will:
- Add the modal partial to your layouts
- Configure JavaScript based on your setup (Importmap, Webpacker, or Asset Pipeline)
- Create an optional configuration initializer

## Usage

After installation, all your existing confirmation dialogs will automatically use the new modals. No code changes required!

### Existing code that just works:

```erb
<!-- Links with confirmations -->
<%= link_to "Delete", item_path(@item),
    method: :delete,
    data: { confirm: "Are you sure?" } %>

<!-- Buttons with confirmations -->
<%= button_to "Remove", item_path(@item),
    method: :delete,
    data: { turbo_confirm: "Delete this item?" } %>

<!-- Forms with confirmations -->
<%= form_with model: @user,
    data: { turbo_confirm: "Save changes?" } do |form| %>
  <!-- form fields -->
<% end %>
```

### Smart Styling

The gem automatically detects destructive actions and styles them appropriately:

- **Red modals** for: delete, remove, destroy, reset, clear, cancel
- **Blue modals** for: save, update, submit, confirm, proceed

## Customization

### Quick Styling Changes

After installation, the modal HTML lives in `app/views/shared/_moderntw_confirms_modal.html.erb`. You can directly edit:

```erb
<!-- Change colors, sizes, spacing as needed -->
<div class="rounded-2xl bg-white p-6">
  <!-- Your customizations here -->
</div>
```

### Configuration Options

Create an initializer to configure the gem:

```ruby
# config/initializers/moderntw_confirms.rb
ModerntwConfirms.configure do |config|
  config[:backdrop_class] = "bg-black/50"
  config[:modal_class] = "rounded-3xl shadow-2xl"
  config[:confirm_button_class] = "bg-indigo-600 hover:bg-indigo-700"
  config[:cancel_button_class] = "bg-gray-200 hover:bg-gray-300"
  config[:enable_on_mobile] = true # Opt into modals on phones/tablets
end
```

### Mobile Behavior

Native confirmation dialogs feel familiar on mobile, so the gem defaults to using the browser's built-in confirms for touch devices. If you prefer the Tailwind modal experience everywhere, set `config[:enable_on_mobile] = true` in your initializer.

### Animation Customization

The animations use CSS transitions and can be modified in the modal partial:

```css
/* Smooth fade in/out */
#moderntw-confirm-modal {
  transition: opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Bounce effect on modal */
#moderntw-confirm-modal [data-modal-panel] {
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

The modal includes automatic fallback to native browser confirms for older browsers or if JavaScript fails.

## Rails Compatibility

- Rails 6.1+ with Webpacker or Asset Pipeline
- Rails 7.0+ with Importmap, Webpacker, or Asset Pipeline
- Full Turbo and Turbo Streams support
- Works with both `data-confirm` (Rails UJS) and `data-turbo-confirm` (Turbo)

## Development

After checking out the repo, run:

```bash
bundle install
```

### Running Tests

```bash
bundle exec rspec
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/rcbt17/moderntw_confirms. This project is intended to be a safe, welcoming space for collaboration.

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Author

**Robin Ciubotaru**
[GitHub](https://github.com/rcbt17)

## Acknowledgments

Built with Rails and Tailwind CSS. Special thanks to the Rails and Hotwire communities for their excellent frameworks.
