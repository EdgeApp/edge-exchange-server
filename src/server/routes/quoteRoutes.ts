import { Serverlet } from 'serverlet'

import { DbRequest } from '../../types/requestTypes'
import { jsonResponse } from '../../types/responseTypes'

/**
 * POST /v2/device
 */
export const quoteRoute: Serverlet<DbRequest> = async request => {
  console.log(request.date)

  return jsonResponse({})
}
