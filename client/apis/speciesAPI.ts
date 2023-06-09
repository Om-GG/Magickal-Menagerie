import request from 'superagent'
import { SpeciesData } from '../../Model/species'

export async function getSpecies(): Promise<SpeciesData[]> {
  try {
    const response = await request.get('/api/v1/species')
    return response.body
  } catch (err) {
    console.error(err)
    throw err
  }
}
