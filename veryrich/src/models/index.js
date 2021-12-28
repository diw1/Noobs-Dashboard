import PlayerModel from './player'
import RaidModel from './raid'
import RoleModel from './role'
import CommonModel from './common'
import {GeneralModel} from './generalModel'

const initModels = (mirror) => {
    mirror.model(GeneralModel(PlayerModel))
    mirror.model(GeneralModel(RaidModel))
    mirror.model(GeneralModel(RoleModel))
    mirror.model(GeneralModel(CommonModel))
}

export default initModels

