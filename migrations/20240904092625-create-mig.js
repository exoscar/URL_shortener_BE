"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("urls", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "id",
      },
      longUrl: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: "long_url",
      },
      shortUrl: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: true,
        field: "short_url",
      },
      customAlias: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: true,
        field: "custom_alias",
      },
      expirationDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP + INTERVAL '10 days'"
        ),
        field: "expiration_date",
      },
      totalClicks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "total_clicks",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "ip_address",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("urls", ["short_url"], {
      name: "short_url_index",
    });
    await queryInterface.addIndex("urls", ["custom_alias"], {
      name: "custom_alias_index",
    });
    await queryInterface.addIndex("urls", ["long_url"], {
      name: "long_url_index",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("urls");
  },
};
