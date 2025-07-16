import { FILE_CONSTRAINTS } from '../config';

/**
 * Класс для представления оборудования
 * 
 * @class Equipment
 */
class Equipment {
  /**
   * Создает экземпляр оборудования
   * 
   * @param {string} name - Наименование оборудования
   * @param {string} inventoryNumber - Инвентарный номер
   * @param {string} maintenancePeriod - Периодичность технического обслуживания
   * @param {string} maintenanceDone - Дата проведенного ТО
   * @param {string} maintenanceNext - Дата следующего ТО
   * @param {string} engineer - ФИО инженера
   * @param {number} [maxLength=100] - Максимальная длина наименования
   */
  constructor(
    name,
    inventoryNumber,
    maintenancePeriod,
    maintenanceDone,
    maintenanceNext,
    engineer,
    maxLength = FILE_CONSTRAINTS.MAX_NAME_LENGTH_DEFAULT
  ) {
    this.name = this.truncateName(name, maxLength);
    this.inventoryNumber = inventoryNumber;
    this.maintenancePeriod = maintenancePeriod;
    this.maintenanceDone = maintenanceDone;
    this.maintenanceNext = maintenanceNext;
    this.engineer = engineer;
  }

  /**
   * Обрезает название до указанной длины
   * 
   * @param {string} name - Исходное название
   * @param {number} maxLength - Максимальная длина
   * @returns {string} Обрезанное название
   */
  truncateName(name, maxLength) {
    if (!name) return '';
    return name.length > maxLength ? name.substring(0, maxLength) : name;
  }

  /**
   * Возвращает строковое представление оборудования для стикера
   * 
   * @returns {string} Отформатированная строка для стикера
   */
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
