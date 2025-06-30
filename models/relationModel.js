const db = require("../database");
const Model = require("./Model");
require("dotenv").config();

class RelationModel extends Model {
  getAllColumns = async () => {
    const columns = await db
      .select(
        `table_name as tableName`,
        `column_name as columnName`,
        `data_type as dataType`
      )
      .from("information_schema.columns")
      .where("table_schema", "public")
      .orderBy(["table_name", "ordinal_position"]);

    const result = {};

    for (const col of columns) {
      const tableField = col.tableName;

      if (!result[tableField]) {
        result[tableField] = [];
      }
      result[tableField].push({
        columnName: col.columnName,
        dataType: col.dataType,
      });
    }

    return result;
  };

  getForeignKeys = async () => {
    const result = await db.raw(`
    SELECT
      tc.table_name AS "sourceTable",
      kcu.column_name AS "sourceColumn",
      ccu.table_name AS "targetTable",
      ccu.column_name AS "targetColumn"
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public';
  `);

    return result.rows;
  };

  getFullStructure = async () => {
    const result = {};
    const relations = await this.getForeignKeys();
    const columns = await this.getAllColumns();

    relations.forEach((relation) => {
      const mainTable = relation["targetTable"];

      if (!result[mainTable]) {
        result[mainTable] = { relations: [] };
      }

      result[mainTable]["relations"].push({
        targetColumn: relation["targetColumn"],
        sourceColumn: relation["sourceColumn"],
        sourceTable: relation["sourceTable"],
      });
    });

    relations.forEach((relation) => {
      const sourceTable = relation["sourceTable"];

      if (!result[sourceTable]) {
        result[sourceTable] = {};
      }
    });

    Object.keys(result).forEach((tableName) => {
      result[tableName]["fields"] = columns[tableName];
    });

    return result;
  };
}

module.exports = new RelationModel();
