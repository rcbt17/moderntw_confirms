ModerntwConfirms.configure do |config|
  # Customize the Tailwind classes for the modal components
  # These are the default values - modify them to match your design system

  # Background overlay classes
  config.backdrop_class = "bg-black bg-opacity-50"

  # Modal container classes
  config.modal_class = "bg-white rounded-lg shadow-xl"

  # Confirm button classes
  config.confirm_button_class = "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"

  # Cancel button classes
  config.cancel_button_class = "bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"

  # You can also add custom classes for specific use cases:
  # For delete confirmations, you might want red buttons:
  # config.delete_confirm_button_class = "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"

  # Use Tailwind modal confirms on mobile devices (defaults to native mobile confirms)
  # Set to true if you prefer the custom modal experience on phones and tablets
  # config.enable_on_mobile = true
end
