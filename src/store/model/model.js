import {functionPermissionList, teamEmployeeDetailVO,moreListCom,currentKey,showEditTeam,showEditmember,companyStatus, msgCount,showNoticeDate, newsNoticeNum} from "./const"

export default {
	state:sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).model: {
		functionPermissionList,
		teamEmployeeDetailVO,
		moreListCom,
		currentKey,
		showEditTeam,
		showEditmember,
        companyStatus,
		msgCount,
		showNoticeDate,
		newsNoticeNum
	},

	getters: {
		showEditmember(state) {
            return state.showEditmember
        },
        showEditTeam(state) {
            return state.showEditTeam
        },
        companyStatus(state) {
            return state.companyStatus
        },
        currentKey(state) {
            return state.currentKey
        },
		msgCount(state) {
			return state.msgCount
		},
		moreListCom(state) {
		    return state.moreListCom
		},
		showNoticeDate(state) {
			return state.showNoticeDate
		},
		newsNoticeNum(state) {
			return state.newsNoticeNum
		},


	},

	mutations: {
		currentKey (state,data) {
            state.currentKey = data
        },
        showEditTeam(state,flag) {
            return state.showEditTeam = flag
        },
        showEditmember(state,flag) {
            return state.showEditmember = flag
        },
        companyStatus(state,flag) {
            return state.companyStatus = flag
        },
		functionPermissionList(state, data) {
			state.functionPermissionList = data;
		},
		teamEmployeeDetailVO(state, data) {
			state.teamEmployeeDetailVO = data;
		},
		msgCount(state, data) {
			state.msgCount = data;
		},
		moreListCom(state, data) {
			state.moreListCom = data;
		},
		showNoticeDate(state, data) {
			state.showNoticeDate = data;
		},
		newsNoticeNum(state, data) {
			state.newsNoticeNum = data;
		},


	},

	actions: {
		// showAddmemberFun (context,flag) {
		//     context.commit('showAddmember',flag)
		// }
	}
}
