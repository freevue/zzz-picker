import { SUPABASE_ANON_KEY, supabase } from './utils'
import { defaultDataIdFromObject } from '@apollo/client'
import { ApolloClient, InMemoryCache, ApolloLink, Observable } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'
import { ApolloProvider } from '@apollo/client/react'
import { pipe } from '@fxts/core'

const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    try {
      pipe(
        supabase,
        ({ auth }) => auth.getSession(),
        ({ data }) => {
          operation.setContext({
            headers: {
              Authorization: data.session?.access_token
                ? `Bearer ${data.session.access_token}`
                : '',
              apikey: SUPABASE_ANON_KEY,
            },
          })

          const subscriber = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })

          return () => subscriber.unsubscribe()
        }
      )
    } catch (error) {
      observer.error(error)
    }
  })
})

const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    if ('nodeId' in responseObject) {
      return `${responseObject.nodeId}`
    }

    return defaultDataIdFromObject(responseObject)
  },
})
const httpLink = new HttpLink({ uri: `${process.env.SUPABASE_URL!}/graphql/v1` })
const client = new ApolloClient({ cache, link: authLink.concat(httpLink) })

const Provider: React.FC<{ children: React.ReactNode }> = (props) => {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>
}

export default Provider
