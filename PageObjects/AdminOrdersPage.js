class AdminOrdersPage {
  constructor(page) {
    this.page = page;
    this.main = page.getByRole('main');
    this.ordersTable = this.main.locator('.table-wrap').getByRole('table');
  }

  orderRow(identifier, status) {
    let row = this.main.locator('tbody').getByRole('row').filter({ hasText: identifier });
    if (status) {
      row = row.filter({ hasText: status });
    }
    return row.first();
  }

  statusBadge(identifier, status) {
    return this.orderRow(identifier, status).locator('.status-badge');
  }

  statusDropdown(identifier, status) {
    return this.orderRow(identifier, status).getByRole('combobox');
  }

  async updateOrderStatus(identifier, newStatus, currentStatus) {
    await this.statusDropdown(identifier, currentStatus).selectOption(newStatus);
  }
}

module.exports = { AdminOrdersPage };
