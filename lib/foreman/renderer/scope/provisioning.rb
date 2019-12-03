module Foreman
  module Renderer
    module Scope
      class Provisioning < Foreman::Renderer::Scope::Template
        extend ApipieDSL::Class
        apipie :class, desc: 'Provisioning' do
        end
        include Foreman::Renderer::Scope::Macros::HostTemplate
        include Foreman::Renderer::Scope::Variables::Base
      end
    end
  end
end
