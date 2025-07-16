class Equipment {
  constructor(
    name,
    inventoryNumber,
    maintenancePeriod,
    maintenanceDone,
    maintenanceNext,
    engineer,
    maxLength = 100
  ) {
    this.name = this.truncateName(name, maxLength);
    this.inventoryNumber = inventoryNumber;
    this.maintenancePeriod = maintenancePeriod;
    this.maintenanceDone = maintenanceDone;
    this.maintenanceNext = maintenanceNext;
    this.engineer = engineer;
  }

  truncateName(name, maxLength) {
    if (!name) return '';
    return name.length > maxLength ? name.substring(0, maxLength) : name;
  }

  toString() {
    return `Наименование: ${this.name}
Инв. №: ${this.inventoryNumber}
Периодичность ТО: ${this.maintenancePeriod}
Проведено ТО: ${this.maintenanceDone}
Следующее ТО: ${this.maintenanceNext}
Инженер ОЭиРМО: ${this.engineer}`;
  }
}

export default Equipment;
