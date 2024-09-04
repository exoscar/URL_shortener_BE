"use strict";
import { v4 as uuidv4 } from "uuid";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class URL extends Model {}

  URL.init(
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        field: "id",
      },
      longUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "long_url",
      },
      shortUrl: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
        field: "short_url",
      },
      customAlias: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
        field: "custom_alias",
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: () => {
          const now = new Date();
          now.setDate(now.getDate() + 10);
          return now;
        },
        field: "expiration_date",
      },
      totalClicks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "total_clicks",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "URL",
      tableName: "urls",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          name: "short_url_index",
          fields: ["shortUrl"],
        },
        {
          name: "custom_alias_index",
          fields: ["customAlias"],
        },
        {
          name: "long_url_index",
          fields: ["longUrl"],
        },
      ],
    }
  );

  return URL;
};
