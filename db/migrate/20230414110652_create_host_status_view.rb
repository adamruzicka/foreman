class CreateHostStatusView < ActiveRecord::Migration[6.1]
  def up
    add_column :host_status, :valid_until, :datetime
    add_column :host_status, :temporary_status, :integer

    sql = <<~SQL
      CREATE VIEW host_status_view AS
        SELECT id, type, host_id, reported_at, status AS final_status, temporary_status, valid_until,
          CASE WHEN valid_until IS NULL THEN status
               WHEN current_timestamp < valid_until THEN temporary_status
               ELSE status
          END AS status
        FROM host_status;
    SQL
    execute(sql)
  end

  def down
    execute("UPDATE host_status_view SET final_status = status")
    execute("DROP VIEW host_status_view")
    remove_column :host_status, :valid_until
    remove_column :host_status, :temporary_status
  end
end
