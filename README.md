## Introduction

The MyClipBoard database API follows REST semantics, uses JSON for data encoding, and relies on standard HTTP codes for signaling operation outcomes.

Database ID: `179724`  
Example API clients: [axios](https://github.com/axios/axios) (JavaScript), [requests](https://requests.readthedocs.io/en/master/) (Python)

## Authentication

Baserow uses token-based authentication. Generate a database token in your settings. You can set permissions (create, read, update, delete) up to table level per token. Authenticate via the HTTP authorization bearer token header. All API requests must be authenticated and made over HTTPS.

```
curl -H "Authorization: Token YOUR_DATABASE_TOKEN" "https://api.baserow.io"
```

## Table table (ID: `441023`)

### Fields

| ID | Name | Type | Compatible filters |
|---|---|---|---|
| field\_3420227 | Id | `autonumber` | `equal``not_equal``contains``contains_not``higher_than``higher_than_or_equal``lower_than``lower_than_or_equal``is_even_and_whole` |
| field\_3420228 | Notes | `string` | `equal``not_equal``contains``contains_not``contains_word``doesnt_contain_word``length_is_lower_than``empty``not_empty` |

### List fields

`GET` request to the Table fields endpoint. Requires read, create, or update permissions.

**Result field properties:**

*   `integer`: Field primary key (use `field_` prefix for column name).
*   `integer`: Related table id.
*   `integer`: Field order in table (0 for the first).
*   `boolean`: Indicates if the field is a primary field.
*   `string`: Field type.
*   `boolean`: Indicates if the field is read-only.

```
GET https://api.baserow.io/api/database/fields/table/441023/
```

```
curl -X GET -H "Authorization: Token YOUR_DATABASE_TOKEN" "https://api.baserow.io/api/database/fields/table/441023/"
```

```json
[
    { "id": 3420227, "table_id": 441023, "name": "Id", "order": 0, "type": "autonumber", "primary": true, "read_only": true, "description": "A sample description" },
    { "id": 3420228, "table_id": 441023, "name": "Notes", "order": 1, "type": "long_text", "primary": false, "read_only": false, "description": "A sample description" }
]
```

### List rows

`GET` request to the Table endpoint.  Paginated response.

**Query parameters:**

*   `page` (integer, default: 1): Page number.
*   `size` (integer, default: 100): Rows per page.
*   `user_field_names` (optional, any): If set to `y`, `yes`, `true`, `t`, `on`, `1`, or empty string, returns actual field names instead of `field_{id}`.  Changes the behavior of `order_by`, `include`, and `exclude`.
*   `search` (string, default: ''): Filter rows by search query.
*   `order_by` (string, default: 'id'):  Comma-separated list of fields to order by (+/- prefix for ascending/descending). When user_field_names is provided, real field names should be used.
*   `filters` (JSON): JSON serialized string containing the filter tree to apply to this view.
*   `filter__{field}\_\_{filter}` (optional, string): Filters using view filters. (e.g., `filter__Name__equal=test`). If the filters parameter is provided, this parameter will be ignored.
*   `filter_type` (string, default: 'AND'): 'AND' or 'OR' for multiple filters.
*   `include` (string): Comma-separated list of field names to include.
*   `exclude` (string): Comma-separated list of field names to exclude.
*   `view_id` (integer): Apply filters and sorts of a view by providing its ID in the `view_id` GET parameter.
*   `{link_row_field}__join` (optional, string): Comma-separated list of field names to lookup from a linked table.

```
GET https://api.baserow.io/api/database/rows/table/441023/?user_field_names=true
```

```
curl -X GET -H "Authorization: Token YOUR_DATABASE_TOKEN" "https://api.baserow.io/api/database/rows/table/441023/?user_field_names=true"
```

```json
{
    "count": 1024,
    "next": "https://api.baserow.io/api/database/rows/table/441023/?page=2",
    "previous": null,
    "results": [
        {
            "id": 0,
            "order": "1.00000000000000000000",
            "Id": "1",
            "Notes": "string"
        }
    ]
}
```

### Get row

`GET` request to fetch a single row.

**Path parameters:**

*   `row_id` (integer): Row identifier.

**Query parameters:**

*   `user_field_names` (optional, any): Returns actual field names if set.

```
GET https://api.baserow.io/api/database/rows/table/441023/{row_id}/?user_field_names=true
```

```
curl -X GET -H "Authorization: Token YOUR_DATABASE_TOKEN" "https://api.baserow.io/api/database/rows/table/441023/{row_id}/?user_field_names=true"
```

```json
{
    "id": 0,
    "order": "1.00000000000000000000",
    "Id": "1",
    "Notes": "string"
}
```

### Create row

`POST` request to create a new row.

**Query parameters:**

*   `user_field_names` (optional, any): Returns actual field names if set.
*   `before_id` (integer): Position new row before the specified row.
*   `send_webhook_events` (optional, any): Triggers webhooks if set to `y`, `yes`, `true`, `t`, `on`, `1` or left empty.

**Request body schema:**

*   `Notes field_3420228` (optional, string): Value for the "Notes" field.

```
POST https://api.baserow.io/api/database/rows/table/441023/?user_field_names=true
```

```
curl -X POST -H "Authorization: Token YOUR_DATABASE_TOKEN" -H "Content-Type: application/json" "https://api.baserow.io/api/database/rows/table/441023/?user_field_names=true" --data '{ "Notes": "string" }'
```

```json
{
    "id": 0,
    "order": "1.00000000000000000000",
    "Id": "1",
    "Notes": "string"
}
```

### Update row

`PATCH` request to update an existing row.

**Path parameters:**

*   `row_id` (integer): Row identifier.

**Query parameters:**

*   `user_field_names` (optional, any): Returns actual field names if set.
*   `send_webhook_events` (optional, any): Triggers webhooks if set to `y`, `yes`, `true`, `t`, `on`, `1` or left empty.

**Request body schema:**

*   `Notes field_3420228` (optional, string): New value for the "Notes" field.

```
PATCH https://api.baserow.io/api/database/rows/table/441023/{row_id}/?user_field_names=true
```

```
curl -X PATCH -H "Authorization: Token YOUR_DATABASE_TOKEN" -H "Content-Type: application/json" "https://api.baserow.io/api/database/rows/table/441023/{row_id}/?user_field_names=true" --data '{ "Notes": "string" }'
```

```json
{
    "id": 0,
    "order": "1.00000000000000000000",
    "Id": "1",
    "Notes": "string"
}
```

### Move row

`PATCH` request to move a row before another row.

**Path parameters:**

*   `row_id` (integer): Row identifier to move.

**Query parameters:**

*   `user_field_names` (optional, any): Returns actual field names if set.
*   `before_id` (integer): Row to move before.  If omitted, moves to the end.
*   `send_webhook_events` (optional, any): Triggers webhooks if set to `y`, `yes`, `true`, `t`, `on`, `1` or left empty.

```
PATCH https://api.baserow.io/api/database/rows/table/441023/{row_id}/move/
```

```
curl -X PATCH -H "Authorization: Token YOUR_DATABASE_TOKEN" "https://api.baserow.io/api/database/rows/table/441023/{row_id}/move/"
```

```json
{
    "id": 0,
    "order": "1.00000000000000000000",
    "Id": "1",
    "Notes": "string"
}
```

### Delete row

`DELETE` request to delete a row.

**Path parameters:**

*   `row_id` (integer): Row identifier to delete.

**Query parameters:**

*   `send_webhook_events` (optional, any): Triggers webhooks if set to `y`, `yes`, `true`, `t`, `on`, `1` or left empty.

```
DELETE https://api.baserow.io/api/database/rows/table/441023/{row_id}/
```

```
curl -X DELETE -H "Authorization: Token YOUR_DATABASE_TOKEN" "https://api.baserow.io/api/database/rows/table/441023/{row_id}/"
```

### Upload file

Uploads a file.  Expects a `file` multipart.  The response `url` can be used to upload a file to a row.

**Request body schema:**

*   `file` (multipart): File contents.

```
POST https://api.baserow.io/api/user-files/upload-file/
```

```
curl -X POST -H "Authorization: Token YOUR_DATABASE_TOKEN" -F file=@photo.png "https://api.baserow.io/api/user-files/upload-file/"
```

```json
{
    "url": "https://files.baserow.io/user_files/...",
    "thumbnails": { "tiny": { "url": "...", "width": 21, "height": 21 }, "small": { "url": "...", "width": 48, "height": 48 } },
    "name": "...",
    "size": 229940,
    "mime_type": "image/png",
    "is_image": true,
    "image_width": 1280,
    "image_height": 585,
    "uploaded_at": "2020-11-17T12:16:10.035234+00:00"
}
```

### Upload file via URL

Uploads a file from a URL.  The response `url` can be used to upload a file to a row.

**Request body schema:**

*   `url` (string): URL of the file to download.

```
POST https://api.baserow.io/api/user-files/upload-via-url/
```

```
curl -X POST -H "Authorization: Token YOUR_DATABASE_TOKEN" -H "Content-Type: application/json" "https://api.baserow.io/api/user-files/upload-via-url/" --data '{ "url": "https://baserow.io/assets/photo.png" }'
```

```json
{
    "url": "https://files.baserow.io/user_files/...",
    "thumbnails": { "tiny": { "url": "...", "width": 21, "height": 21 }, "small": { "url": "...", "width": 48, "height": 48 } },
    "name": "...",
    "size": 229940,
    "mime_type": "image/png",
    "is_image": true,
    "image_width": 1280,
    "image_height": 585,
    "uploaded_at": "2020-11-17T12:16:10.035234+00:00"
}
```

## Filters

| Filter | Example value | Full example |
|---|---|---|
| equal | string | field is 'string' |
| not\_equal | string | field is not 'string' |
| date\_is | UTC??today | field is 'UTC??today' |
| date\_is\_not | UTC??today | field is not 'UTC??today' |
| date\_is\_before | UTC??today | field is before 'UTC??today' |
| date\_is\_on\_or\_before | UTC??today | field is on or before 'UTC??today' |
| date\_is\_after | UTC??today | field is after 'UTC??today' |
| date\_is\_on\_or\_after | UTC??today | field is on or after 'UTC??today' |
| date\_is\_within | UTC??today | field is within 'UTC??today' |
| date\_equal | 2020-01-01 | field is date '2020-01-01' |
| date\_not\_equal | 2020-01-01 | field is not date '2020-01-01' |
| date\_equals\_today | UTC | field is today 'UTC' |
| date\_before\_today | UTC | field is before today 'UTC' |
| date\_after\_today | UTC | field is after today 'UTC' |
| date\_within\_days | Asia/Riyadh?1 | field is within days 'Asia/Riyadh?1' |
| date\_within\_weeks | Asia/Riyadh?1 | field is within weeks 'Asia/Riyadh?1' |
| date\_within\_months | Asia/Riyadh?1 | field is within months 'Asia/Riyadh?1' |
| date\_equals\_days\_ago | Asia/Riyadh?1 | field is days ago 'Asia/Riyadh?1' |
| date\_equals\_months\_ago | Asia/Riyadh?1 | field is months ago 'Asia/Riyadh?1' |
| date\_equals\_years\_ago | Asia/Riyadh?1 | field is years ago 'Asia/Riyadh?1' |
| date\_equals\_week | UTC | field in this week 'UTC' |
| date\_equals\_month | UTC | field in this month 'UTC' |
| date\_equals\_year | UTC | field in this year 'UTC' |
| date\_equals\_day\_of\_month | 1 | field day of month is '1' |
| date\_before | 2020-01-01 | field is before date '2020-01-01' |
| date\_before\_or\_equal | 2020-01-01 | field is before or same date '2020-01-01' |
| date\_after | 2020-01-01 | field is after date '2020-01-01' |
| date\_after\_or\_equal | 2020-01-01 | field is after or same date '2020-01-01' |
| date\_after\_days\_ago | 20 | field is after days ago '20' |
| has\_empty\_value | string | field has empty value 'string' |
| has\_not\_empty\_value | string | field doesn't have empty value 'string' |
| has\_value\_equal | string | field has value equal 'string' |
| has\_not\_value\_equal | string | field doesn't have value equal 'string' |
| has\_value\_contains | string | field has value contains 'string' |
| has\_not\_value\_contains | string | field doesn't have value contains 'string' |
| has\_value\_contains\_word | string | field has value contains word 'string' |
| has\_not\_value\_contains\_word | string | field doesn't have value contains word 'string' |
| has\_value\_length\_is\_lower\_than | string | field has value length is lower than 'string' |
| has\_all\_values\_equal | string | field has all values equal 'string' |
| has\_any\_select\_option\_equal | string | field has any select option equal 'string' |
| has\_none\_select\_option\_equal | string | field doesn't have select option equal 'string' |
| contains | string | field contains 'string' |
| contains\_not | string | field doesn't contain 'string' |
| contains\_word | string | field contains word 'string' |
| doesnt\_contain\_word | string | field doesn't contain word 'string' |
| filename\_contains | string | field filename contains 'string' |
| has\_file\_type | image | document | field has file type 'image | document' |
| files\_lower\_than | 2 | field files lower than '2' |
| length\_is\_lower\_than | 5 | field length is lower than '5' |
| higher\_than | 100 | field higher than '100' |
| higher\_than\_or\_equal | 100 | field higher than or equal '100' |
| lower\_than | 100 | field lower than '100' |
| lower\_than\_or\_equal | 100 | field lower than or equal '100' |
| is\_even\_and\_whole | true | field is even and whole 'true' |
| single\_select\_equal | 1 | field is '1' |
| single\_select\_not\_equal | 1 | field is not '1' |
| single\_select\_is\_any\_of | 1,2 | field is any of '1,2' |
| single\_select\_is\_none\_of | 1,2 | field is none of '1,2' |
| boolean | true | field is 'true' |
| link\_row\_has | 1 | field has '1' |
| link\_row\_has\_not | 1 | field doesn't have '1' |
| link\_row\_contains | string | field contains 'string' |
| link\_row\_not\_contains | string | field doesn't contain 'string' |
| multiple\_select\_has | 1 | field has '1' |
| multiple\_select\_has\_not | 1 | field doesn't have '1' |
| multiple\_collaborators\_has | 1 | field has '1' |
| multiple\_collaborators\_has\_not | 1 | field doesn't have '1' |
| empty |  | field is empty |
| not\_empty |  | field is not empty |
| user\_is | 1 | field is '1' |
| user\_is\_not | 1 | field is not '1' |

## HTTP Errors

| Error code | Name | Description |
|---|---|---|
| 200 | Ok | Request completed successfully. |
| 400 | Bad request | The request contains invalid values or the JSON could not be parsed. |
| 401 | Unauthorized | When you try to access an endpoint without a valid database token. |
| 404 | Not found | Row or table is not found. |
| 413 | Request Entity Too Large | The request exceeded the maximum allowed payload size. |
| 500 | Internal Server Error | The server encountered an unexpected condition. |
| 502 | Bad gateway | Baserow is restarting or an unexpected outage is in progress. |
| 503 | Service unavailable | The server could not process your request in time. |

```
curl -H "Authorization: Token YOUR_DATABASE_TOKEN" "https://api.baserow.io"
```

```json
{
    "error": "ERROR_NO_PERMISSION_TO_TABLE",
    "description": "The token does not have permissions to the table."
}

# Shared Clipboard

A React TypeScript application that uses Baserow as a backend for sharing clipboard content across devices.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
VITE_BASEROW_API_TOKEN=your_api_token_here
VITE_BASEROW_TABLE_ID=441023
```

## Baserow API Reference

### Authentication
All requests to the Baserow API must include an Authorization header with your API token:
```
Authorization: Token your_api_token_here
```

### Endpoints

#### 1. List Rows
```
GET https://api.baserow.io/api/database/rows/table/{table_id}/
```
Returns a list of all rows in the specified table.

Response format:
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "field_3420227": 1,
      "field_3420228": "Example note content"
    }
  ]
}
```

#### 2. Create Row
```
POST https://api.baserow.io/api/database/rows/table/{table_id}/
```
Creates a new row in the specified table.

Request body:
```json
{
  "field_3420228": "New note content"
}
```

#### 3. Delete Row
```
DELETE https://api.baserow.io/api/database/rows/table/{table_id}/{row_id}/
```
Deletes the specified row from the table.

## Development

Run the development server:
```bash
npm run dev
```

## Build

Build for production:
```bash
npm run build
```

## Type Definitions

The application uses TypeScript interfaces to ensure type safety:

```typescript
interface ClipboardItem {
  id: number;
  field_3420227: number; // Id field
  field_3420228: string; // Notes field
}
```

## Features

- View shared clipboard items
- Add new clipboard content
- Delete existing clipboard items
- Real-time updates when data changes
- Type-safe implementation with TypeScript
- Clean and modern UI
- Copy to clipboard functionality
- Mobile-responsive design