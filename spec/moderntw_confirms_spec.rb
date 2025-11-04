# frozen_string_literal: true

RSpec.describe ModerntwConfirms do
  it "has a version number" do
    expect(ModerntwConfirms::VERSION).not_to be nil
  end

  it "defaults to mobile fallback" do
    expect(ModerntwConfirms.config.enable_on_mobile).to eq(false)
  end
end
