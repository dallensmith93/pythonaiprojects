export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PATCH'
  path: string
  requestSchema: string
  responseSchema: string
}

export interface ApiSchemaOutput {
  service: string
  endpoints: ApiEndpoint[]
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function generateApiSchema(featureIdea: string): ApiSchemaOutput {
  const slug = slugify(featureIdea || 'resource')
  const resource = slug || 'resource'

  return {
    service: `${resource}-service`,
    endpoints: [
      {
        method: 'GET',
        path: `/api/${resource}`,
        requestSchema: '{ "query": string, "page": number }',
        responseSchema: '{ "items": Array<object>, "total": number }'
      },
      {
        method: 'POST',
        path: `/api/${resource}`,
        requestSchema: '{ "name": string, "details": string }',
        responseSchema: '{ "id": string, "name": string, "details": string }'
      },
      {
        method: 'PATCH',
        path: `/api/${resource}/{id}`,
        requestSchema: '{ "name?": string, "details?": string }',
        responseSchema: '{ "id": string, "updated": boolean }'
      }
    ]
  }
}
