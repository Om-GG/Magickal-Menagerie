import knex from 'knex'
import {
  getPetInfo,
  getUserInventory,
  updatePetInfo,
  addANewItem,
  deleteInventoryItem,
} from '../petInteractions'

const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
})

beforeAll(async () => {
  await connection.schema.createTable('pets', (table) => {
    table.increments('id')
    table.string('auth0_id')
    table.integer('species_id')
    table.string('name')
    table.integer('xp_current')
    table.integer('hp_current')
    table.integer('hunger_current')
    table.integer('level')
    table.integer('hp_max')
    table.integer('hunger_max')
    table.string('fave_food')
    table.string('image')
  })

  await connection.schema.createTable('user', (table) => {
    table.string('auth0_id')
    table.string('email')
  })

  await connection.schema.createTable('species', (table) => {
    table.increments('id')
    table.string('name')
    table.string('image')
  })

  await connection.schema.createTable('inventory', (table) => {
    table.increments('id')
    table.string('auth0_id')
    table.integer('item_id')
  })

  await connection.schema.createTable('items', (table) => {
    table.increments('id')
    table.string('name')
    table.string('type')
    table.string('description')
    table.integer('hunger_fill')
    table.integer('hp_fill')
    table.string('image')
  })
})

afterAll(async () => {
  await connection.schema.dropTable('pets')
  await connection.schema.dropTable('user')
  await connection.schema.dropTable('species')
  await connection.schema.dropTable('inventory')
  await connection.schema.dropTable('items')
  await connection.destroy()
})

beforeEach(async () => {
  await connection('pets').truncate()
  await connection('user').truncate()
  await connection('species').truncate()
  await connection('inventory').truncate()
  await connection('items').truncate()

  await connection('user').insert({ auth0_id: 'test', email: 'test@test.com' })
  await connection('species').insert({ name: 'dog', image: 'dog.jpg' })
  await connection('pets').insert({
    auth0_id: 'test',
    species_id: 1,
    name: 'fido',
    xp_current: 0,
    hp_current: 100,
    hunger_current: 100,
    level: 1,
    hp_max: 100,
    hunger_max: 100,
    fave_food: 'bones',
    image: 'dog.jpg',
  })
  await connection('items').insert({
    name: 'bone',
    type: 'food',
    description: 'a tasty bone',
    hunger_fill: 25,
    hp_fill: 10,
    image: 'bone.jpg',
  })
})

describe('getPetInfo', () => {
  it('returns pet info for a given auth0 ID', async () => {
    const petInfo = await getPetInfo('test', connection)

    expect(petInfo).toEqual([
      {
        id: 1,
        auth0Id: 'test',
        speciesId: 1,
        petName: 'fido',
        speciesName: 'dog',
        xpCurrent: 0,
        hpCurrent: 100,
        hungerCurrent: 100,
        level: 1,
        hpMax: 100,
        hungerMax: 100,
        faveFood: 'bones',
        image: 'dog.jpg',
      },
    ])
  })
})

describe('getUserInventory', () => {
  it('returns inventory items for a given auth0 ID', async () => {
    await addANewItem({ auth0Id: 'test', itemId: 1 }, connection)

    const inventory = await getUserInventory('test', connection)

    expect(inventory).toEqual([
      {
        id: 1,
        auth0Id: 'test',
        itemId: 1,
        name: 'bone',
        type: 'food',
        description: 'a tasty bone',
        hungerFill: 25,
        hpFill: 10,
        image: 'bone.jpg',
      },
    ])
  })
})

describe('updatePetInfo', () => {
  it('updates the current hunger of a pet', async () => {
    await updatePetInfo({
      id: 1, hungerCurrent: 75,
      auth0Id: '',
      speciesId: 0,
      petName: '',
      xpCurrent: 0,
      hpCurrent: 0,
      level: 0,
      hpMax: 0,
      hungerMax: 0,
      faveFood: '',
      image: ''
    }, connection)

    const petInfo = await getPetInfo('test', connection)

    expect(petInfo[0].hungerCurrent).toBe(75)
  })
})

describe('addANewItem', () => {
  it('adds a new item to the inventory', async () => {
    await addANewItem({ auth0Id: 'test', itemId: 1 }, connection)

    const inventory = await getUserInventory('test', connection)

    expect(inventory).toEqual([
      {
        id: 1,
        auth0Id: 'test',
        itemId: 1,
        name: 'bone',
        type: 'food',
        description: 'a tasty bone',
        hungerFill: 25,
        hpFill: 10,
        image: 'bone.jpg',
      },
    ])
  })
})

describe('deleteInventoryItem', () => {
  it('deletes an inventory item by ID', async () => {
    await addANewItem({ auth0Id: 'test', itemId: 1 }, connection)

    await deleteInventoryItem(1, connection)

    const inventory = await getUserInventory('test', connection)

    expect(inventory).toEqual([])
  })
})