# Manual Instructions

If the `Cosmos DB Connection String Reader` Custom Role exists, update assignable scope to designated RG.

If the `Cosmos DB Connection String Reader` Custom Role does NOT exist, create Custom Role

```json
{
  "id": "/subscriptions/.../providers/Microsoft.Authorization/roleDefinitions/....",
  "properties": {
    "roleName": "Cosmos DB Connection String Reader",
    "description": "Can list connection strings for Cosmos DB accounts.",
    "assignableScopes": ["/subscriptions/.../resourceGroups/...."],
    "permissions": [
      {
        "actions": ["Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action"],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
```
