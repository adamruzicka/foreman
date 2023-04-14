module HostStatus
  class Status < ApplicationRecord
    prepend Foreman::STI

    self.table_name = 'host_status_view'
    self.primary_key = :id

    belongs_to_host :inverse_of => :host_statuses

    validates :host, :presence => true
    validates :host_id, :uniqueness => {:scope => :type}
    validates :reported_at, :presence => true

    before_validation :update_timestamp, :if => ->(status) { status.reported_at.blank? }

    def self.presenter
      ::HostStatusPresenter.new(self)
    end

    class Jail < ::Safemode::Jail
      allow :host, :to_global, :to_label, :status, :name, :relevant?
      allow_class_method :status_name, :humanized_name
    end

    def to_global(options = {})
      HostStatus::Global::OK
    end

    def to_label(options = {})
      raise NotImplementedError, "Method 'to_label' method needs to be implemented"
    end

    def to_status(options = {})
      # By default return the same value the status already has.
      # Override this method with a way to recalculate the status based on
      # external values
      status
    end

    def self.status_name
      raise NotImplementedError, "Method 'status_name' method needs to be implemented"
    end

    def name
      self.class.status_name
    end

    def self.humanized_name
      status_name.underscore
    end

    def refresh!
      refresh
      save!
    end

    def refresh
      update_timestamp
      update_status
    end

    # Whether this status should be displayed to users, it may not be relevant for certain
    # types of hosts
    def relevant?(options = {})
      true
    end

    # a substatus is used by some other status in order to determine its own status
    # this type of status does not affect the global status
    def substatus?(options = {})
      false
    end

    def status_link
    end

    def with_transition_from(status)
    end

    private

    def update_timestamp
      self.reported_at = Time.now.utc
    end

    def update_status
      calculated_status  = to_status
      if (timestamp, state = with_transition_from(calculated_status))
        self.valid_until = timestamp
        self.temporary_status = calculated_status
        self.final_status = state
      else
        self.valid_until = nil
        self.temporary_status = nil
        self.final_status = calculated_status
      end
    end
  end
end

require_dependency 'host_status/configuration_status'
require_dependency 'host_status/build_status'
