const express = require('express');
const router = express.Router();

const keywordService = require('../services/keywordService');

// 사용자 회원가입(?), 자유 보관함, 일정 보관함, 리뷰 생성 시 주어지는 키워드 리스트
// 리스트 반환
router.get('/list', async (req, res) => {
    let result;
    try {
        result = await keywordService.readKeywordList(); 
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data : result
    });
});

module.exports = router;