var ip = 'http://202.206.249.16:8080/dxpj/hp/'
var urlList = {
    department: {
        get: ['get_party_selected', 'GET']
    },
    people: {
        get: ['get_partyMember_byPartyId', 'GET'],
        judge: ['judge_partyMember_byMemberId', 'GET']
    },
    message: {
        save: ['save_questionAndAnswer', 'POST']
    },
    sound: {
        get: ['video_words', 'POST']
    }
}
