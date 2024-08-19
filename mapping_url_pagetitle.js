function () {
    // 현재 페이지의 URL을 가져옴
    var url = {{Page URL}};
    var defaultTitle = {{content-name}};

    // 여기서 url regex 조건과 타이틀 맵핑
    var mappings = [
        { regex: /main\/card/, title: "띵샵>상품>상세>123", id: "CARD_ABC" },
        { regex: /main\/discovery/, title: "발견>A>B>C>D", id: "DISCOVERY_ABC" },
    ];

    // url & 타이틀 맵핑
    var matchedMapping = mappings.find(function(mapping) {
        return mapping.regex.test(url); 
    });

    var result = {
        page_title: defaultTitle,
        screen_id: defaultTitle,
        depth1: "",
        depth2: "",
        depth3: "",
        depth4: "",
        depth5: ""
    };

    if (matchedMapping) {
        var titles = matchedMapping.title.split('>');
        result.page_title = matchedMapping.title;
        result.screen_id = matchedMapping.id;
        result.depth1 = titles[0] || "";
        result.depth2 = titles[1] || "";
        result.depth3 = titles[2] || "";
        result.depth4 = titles[3] || "";
        result.depth5 = titles.slice(4).join('>') || "";
    }

    console.log('mapping result:', result);
    return result;
}
