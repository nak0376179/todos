import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import { paths } from '@/types/api'

const fetchClient = createFetchClient<paths>({
  baseUrl: 'http://localhost:8000',
})
export const api = createClient(fetchClient)
