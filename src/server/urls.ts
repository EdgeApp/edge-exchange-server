import { pickMethod, pickPath, Serverlet } from 'serverlet'

import { DbRequest } from '../types/requestTypes'
import { errorResponse, jsonResponse } from '../types/responseTypes'
import { quoteRoute } from './routes/quoteRoutes'

const missingRoute: Serverlet<DbRequest> = request =>
  errorResponse(`Unknown API endpoint ${request.path}`, { status: 404 })

const healthCheckRoute: Serverlet<DbRequest> = () => jsonResponse({})

const urls: { [path: string]: Serverlet<DbRequest> } = {
  '/': healthCheckRoute,

  // '/v1/notification/send/?': pickMethod({
  //   POST: withLegacyApiKey(sendNotificationV1Route)
  // })

  // // The GUI accesses `/v1//user?userId=...` with an extra `/`:
  // '/v1/+user/?': pickMethod({
  //   GET: withLegacyApiKey(fetchStateV1Route)
  // }),
  // '/v1/user/device/attach/?': pickMethod({
  //   POST: withLegacyApiKey(attachUserV1Route)
  // }),
  // '/v1/user/notifications/?': pickMethod({
  //   POST: withLegacyApiKey(registerCurrenciesV1Route)
  // }),
  // '/v1/user/notifications/toggle/?': pickMethod({
  //   POST: withLegacyApiKey(toggleStateV1Route)
  // }),
  // '/v1/user/notifications/[0-9A-Za-z]+/?': pickMethod({
  //   GET: withLegacyApiKey(fetchCurrencyV1Route),
  //   PUT: withLegacyApiKey(enableCurrencyV1Route)
  // }),

  '/v1/getQuote/?': pickMethod({
    POST: quoteRoute
  })
  // '/v2/device/update/?': pickMethod({
  //   POST: deviceUpdateRoute
  // }),
  // '/v2/login/?': pickMethod({
  //   POST: loginFetchRoute
  // }),
  // '/v2/login/update/?': pickMethod({
  //   POST: loginUpdateRoute
  // })
}
export const allRoutes: Serverlet<DbRequest> = pickPath(urls, missingRoute)
