module.exports = {
        typeDefs: /* GraphQL */ `type AggregateRouletteHistory {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

scalar Long

type Mutation {
  createRouletteHistory(data: RouletteHistoryCreateInput!): RouletteHistory!
  updateRouletteHistory(data: RouletteHistoryUpdateInput!, where: RouletteHistoryWhereUniqueInput!): RouletteHistory
  updateManyRouletteHistories(data: RouletteHistoryUpdateManyMutationInput!, where: RouletteHistoryWhereInput): BatchPayload!
  upsertRouletteHistory(where: RouletteHistoryWhereUniqueInput!, create: RouletteHistoryCreateInput!, update: RouletteHistoryUpdateInput!): RouletteHistory!
  deleteRouletteHistory(where: RouletteHistoryWhereUniqueInput!): RouletteHistory
  deleteManyRouletteHistories(where: RouletteHistoryWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  rouletteHistory(where: RouletteHistoryWhereUniqueInput!): RouletteHistory
  rouletteHistories(where: RouletteHistoryWhereInput, orderBy: RouletteHistoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [RouletteHistory]!
  rouletteHistoriesConnection(where: RouletteHistoryWhereInput, orderBy: RouletteHistoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): RouletteHistoryConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type RouletteHistory {
  id: ID!
  user: User!
  hittedAt: DateTime!
}

type RouletteHistoryConnection {
  pageInfo: PageInfo!
  edges: [RouletteHistoryEdge]!
  aggregate: AggregateRouletteHistory!
}

input RouletteHistoryCreateInput {
  user: UserCreateOneInput!
  hittedAt: DateTime!
}

type RouletteHistoryEdge {
  node: RouletteHistory!
  cursor: String!
}

enum RouletteHistoryOrderByInput {
  id_ASC
  id_DESC
  hittedAt_ASC
  hittedAt_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type RouletteHistoryPreviousValues {
  id: ID!
  hittedAt: DateTime!
}

type RouletteHistorySubscriptionPayload {
  mutation: MutationType!
  node: RouletteHistory
  updatedFields: [String!]
  previousValues: RouletteHistoryPreviousValues
}

input RouletteHistorySubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: RouletteHistoryWhereInput
  AND: [RouletteHistorySubscriptionWhereInput!]
  OR: [RouletteHistorySubscriptionWhereInput!]
  NOT: [RouletteHistorySubscriptionWhereInput!]
}

input RouletteHistoryUpdateInput {
  user: UserUpdateOneRequiredInput
  hittedAt: DateTime
}

input RouletteHistoryUpdateManyMutationInput {
  hittedAt: DateTime
}

input RouletteHistoryWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  user: UserWhereInput
  hittedAt: DateTime
  hittedAt_not: DateTime
  hittedAt_in: [DateTime!]
  hittedAt_not_in: [DateTime!]
  hittedAt_lt: DateTime
  hittedAt_lte: DateTime
  hittedAt_gt: DateTime
  hittedAt_gte: DateTime
  AND: [RouletteHistoryWhereInput!]
  OR: [RouletteHistoryWhereInput!]
  NOT: [RouletteHistoryWhereInput!]
}

input RouletteHistoryWhereUniqueInput {
  id: ID
}

type Subscription {
  rouletteHistory(where: RouletteHistorySubscriptionWhereInput): RouletteHistorySubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  name: String!
  englishName: String
  email: String!
  password: String!
  hitWeight: Int
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  name: String!
  englishName: String
  email: String!
  password: String!
  hitWeight: Int
}

input UserCreateOneInput {
  create: UserCreateInput
  connect: UserWhereUniqueInput
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  englishName_ASC
  englishName_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  hitWeight_ASC
  hitWeight_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  name: String!
  englishName: String
  email: String!
  password: String!
  hitWeight: Int
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateDataInput {
  name: String
  englishName: String
  email: String
  password: String
  hitWeight: Int
}

input UserUpdateInput {
  name: String
  englishName: String
  email: String
  password: String
  hitWeight: Int
}

input UserUpdateManyMutationInput {
  name: String
  englishName: String
  email: String
  password: String
  hitWeight: Int
}

input UserUpdateOneRequiredInput {
  create: UserCreateInput
  update: UserUpdateDataInput
  upsert: UserUpsertNestedInput
  connect: UserWhereUniqueInput
}

input UserUpsertNestedInput {
  update: UserUpdateDataInput!
  create: UserCreateInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  englishName: String
  englishName_not: String
  englishName_in: [String!]
  englishName_not_in: [String!]
  englishName_lt: String
  englishName_lte: String
  englishName_gt: String
  englishName_gte: String
  englishName_contains: String
  englishName_not_contains: String
  englishName_starts_with: String
  englishName_not_starts_with: String
  englishName_ends_with: String
  englishName_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  hitWeight: Int
  hitWeight_not: Int
  hitWeight_in: [Int!]
  hitWeight_not_in: [Int!]
  hitWeight_lt: Int
  hitWeight_lte: Int
  hitWeight_gt: Int
  hitWeight_gte: Int
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`
      }
    