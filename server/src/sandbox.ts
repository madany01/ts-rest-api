/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker'

const n = 1
for (let i = 0; i < n; i += 1) {
  console.log(
    faker.address.country(),
    ' --- ',
    faker.address.cityName(),
    ' --- ',
    faker.address.street(),
    ' --- ',
    faker.address.buildingNumber()
  )
}
