import PlayerModel from './player'
import RaidModel from './raid'
import {GeneralModel} from './generalModel'

const initModels = (mirror) => {
    mirror.model(GeneralModel(PlayerModel))
    mirror.model(GeneralModel(RaidModel))
}

export default initModels

