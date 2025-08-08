[
  {
    pseudonym: "123213",
    type: "field",
    content: { tableName: "orders", fieldName: "status", joins: [] },
    comparisonType: "numerical",
  },
  {
    pseudonym: "renter_average_rating",
    type: "template",
    content: [
      {
        key: "avg",
        body: "Avg",
        subItems: [
          {
            key: "table_selects",
            body: "Table Selects",
            content: {
              tableName: "rc1",
              fieldName: "care",
              joins: [
                {
                  baseTable: "orders",
                  baseField: "id",
                  joinedTable: "renter_comments",
                  joinedField: "order_id",
                  pseudonym: "rc1",
                },
              ],
              pseudonym: "rc_avg_care",
            },
            id: "776f59c3fbea02075efc574e120a696d018166e6",
          },
          { key: "+", body: "+", id: "operation-test" },
          {
            key: "table_selects",
            body: "Table Selects",
            content: {
              tableName: "rc1",
              fieldName: "timeliness",
              joins: [
                {
                  baseTable: "orders",
                  baseField: "id",
                  joinedTable: "renter_comments",
                  joinedField: "order_id",
                  pseudonym: "rc1",
                },
              ],
              pseudonym: "rc_avg_timeliness",
            },
            id: "d503aefce2ef50746766738305f90d092cd0cc5b",
          },
        ],
        id: "dab907ba98848fceee44111cb4b4a6a3e767c09f",
      },
    ],
    conditions: [
      {
        baseTable: "rc1",
        baseField: "order_id",
        joinCondition: "=",
        joinedTable: "orders",
        joinedField: "id",
      },
    ],
    orders: [],
    groups: [{ baseTable: "rc1", baseField: "care" }],
    comparisonType: "numerical",
  },
];
