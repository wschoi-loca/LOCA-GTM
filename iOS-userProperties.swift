                /// sha 512 cno 두개로 쪼개

                let sha512split = self.splitString(inputString: LocaPreferences.shared().loginInfo?.sha512_cno ?? Defaults.sha512_cno);

 

                gaData["ep_cd120_user_id1"] = sha512split[0];

                gaData["ep_cd121_user_id2"] = sha512split[1];

                

                let dateFormatter = DateFormatter()

                dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSXXX"

                dateFormatter.locale = Locale(identifier: "ko_KR");

                dateFormatter.timeZone = TimeZone(identifier: "Asia/Seoul");

                let currentDate = Date()

                let formattedDate = dateFormatter.string(from: currentDate)

                

                gaData["ep_cd49_timestamp"] = formattedDate

 

                if (LocaConfig.SERVER_MODE == 0)

{                     gaData["ep_cd10_channel_type"] = "APP";                 }
else

{                     gaData["ep_cd10_channel_type"] = "APP_TEST";                 }
                

                ///하이브리드에서 전달하는 값으로 무조건 세팅

                gaData["ep_cd11_native_yn"] = eventParams["ep_cd11_native_yn"];

                

                ///하이브리드에서 올려주는값 누락 검사~

                if (eventParams["ep_cd4_lgn_yn"] as? String)?.isEmpty ?? true

{                     gaData["ep_cd4_lgn_yn"] = LocaPreferences.shared().loginInfo?.gaLogin;                                      }
                

                ///하이브리드에서 올려주는값 누락 검사~

                if (eventParams["ep_cd5_lgn_type"] as? String)?.isEmpty ?? true

{                     gaData["ep_cd5_lgn_type"] = LocaPreferences.shared().loginInfo?.lgnType;                    }
                

                ///하이브리드에서 올려주는값 누락 검사~

                if (eventParams["ep_cd54_lgn_session_id1"] as? String)?.isEmpty ?? true {

                    if (LocaConfig.SERVER_MODE == 0)

{                         let sessionId1 = sha512split[0] + "|" + "APP" + "|" + (LocaPreferences.shared().loginInfo?.lgnDtti ?? "");                         gaData["ep_cd54_lgn_session_id1"] = sessionId1;                                              }
else

{                         let sessionId1 = sha512split[0] + "|" + "APP_TEST" + "|" + (LocaPreferences.shared().loginInfo?.lgnDtti ?? "");                                                  gaData["ep_cd54_lgn_session_id1"] = sessionId1;                                              }
                }

                

                ///하이브리드에서 올려주는값 누락 검사~

                if (eventParams["ep_cd54_lgn_session_id2"] as? String)?.isEmpty ?? true {

                    if (LocaConfig.SERVER_MODE == 0)

{                         let sessionId2 = sha512split[1] + "|" + "APP" + "|" + (LocaPreferences.shared().loginInfo?.lgnDtti ?? "");                         gaData["ep_cd54_lgn_session_id2"] = sessionId2;                                              }
else

{                         let sessionId2 = sha512split[1] + "|" + "APP" + "|" + (LocaPreferences.shared().loginInfo?.lgnDtti ?? "");                           gaData["ep_cd54_lgn_session_id2"] = sessionId2;                                              }
                    

                }

                

                ///하이브리드에서 올려주는값 누락 검사~

                if (eventParams["ep_cd122_lgn_dtti"] as? String)?.isEmpty ?? true

{                     gaData["ep_cd122_lgn_dtti"] = LocaPreferences.shared().loginInfo?.lgnDtti;                 }