/**
 * Created by dinusha on 6/11/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var userProfileCtrl = function ($scope, $stateParams, $filter, $uibModal, userProfileApiAccess, sipUserApiHandler, loginService, authService, jwtHelper, resourceService) {


        $scope.tenant = 0;
        $scope.company = 0;
        $scope.getCompanyTenant = function () {
            var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());
            console.info(decodeData);
            $scope.company = decodeData.company;
            $scope.tenant = decodeData.tenant;
        };
        $scope.getCompanyTenant();
        $scope.isEditState = false;

        $scope.languages = [
            {"code": "ab", "name": "Abkhaz", "nativeName": "?????"},
            {"code": "aa", "name": "Afar", "nativeName": "Afaraf"},
            {"code": "af", "name": "Afrikaans", "nativeName": "Afrikaans"},
            {"code": "ak", "name": "Akan", "nativeName": "Akan"},
            {"code": "sq", "name": "Albanian", "nativeName": "Shqip"},
            {"code": "am", "name": "Amharic", "nativeName": "????"},
            {"code": "ar", "name": "Arabic", "nativeName": "???????"},
            {"code": "an", "name": "Aragonese", "nativeName": "Aragon�s"},
            {"code": "hy", "name": "Armenian", "nativeName": "???????"},
            {"code": "as", "name": "Assamese", "nativeName": "???????"},
            {"code": "av", "name": "Avaric", "nativeName": "???? ????, ???????? ????"},
            {"code": "ae", "name": "Avestan", "nativeName": "avesta"},
            {"code": "ay", "name": "Aymara", "nativeName": "aymar aru"},
            {"code": "az", "name": "Azerbaijani", "nativeName": "az?rbaycan dili"},
            {"code": "bm", "name": "Bambara", "nativeName": "bamanankan"},
            {"code": "ba", "name": "Bashkir", "nativeName": "??????? ????"},
            {"code": "eu", "name": "Basque", "nativeName": "euskara, euskera"},
            {"code": "be", "name": "Belarusian", "nativeName": "??????????"},
            {"code": "bn", "name": "Bengali", "nativeName": "?????"},
            {"code": "bh", "name": "Bihari", "nativeName": "???????"},
            {"code": "bi", "name": "Bislama", "nativeName": "Bislama"},
            {"code": "bs", "name": "Bosnian", "nativeName": "bosanski jezik"},
            {"code": "br", "name": "Breton", "nativeName": "brezhoneg"},
            {"code": "bg", "name": "Bulgarian", "nativeName": "????????? ????"},
            {"code": "my", "name": "Burmese", "nativeName": "?????"},
            {"code": "ca", "name": "Catalan; Valencian", "nativeName": "Catal�"},
            {"code": "ch", "name": "Chamorro", "nativeName": "Chamoru"},
            {"code": "ce", "name": "Chechen", "nativeName": "??????? ????"},
            {"code": "ny", "name": "Chichewa; Chewa; Nyanja", "nativeName": "chiChe?a, chinyanja"},
            {"code": "zh", "name": "Chinese", "nativeName": "?? (Zh?ngw�n), ??, ??"},
            {"code": "cv", "name": "Chuvash", "nativeName": "????? ?????"},
            {"code": "kw", "name": "Cornish", "nativeName": "Kernewek"},
            {"code": "co", "name": "Corsican", "nativeName": "corsu, lingua corsa"},
            {"code": "cr", "name": "Cree", "nativeName": "???????"},
            {"code": "hr", "name": "Croatian", "nativeName": "hrvatski"},
            {"code": "cs", "name": "Czech", "nativeName": "?esky, ?e�tina"},
            {"code": "da", "name": "Danish", "nativeName": "dansk"},
            {"code": "dv", "name": "Divehi; Dhivehi; Maldivian;", "nativeName": "??????"},
            {"code": "nl", "name": "Dutch", "nativeName": "Nederlands, Vlaams"},
            {"code": "en", "name": "English", "nativeName": "English"},
            {"code": "eo", "name": "Esperanto", "nativeName": "Esperanto"},
            {"code": "et", "name": "Estonian", "nativeName": "eesti, eesti keel"},
            {"code": "ee", "name": "Ewe", "nativeName": "E?egbe"},
            {"code": "fo", "name": "Faroese", "nativeName": "f�royskt"},
            {"code": "fj", "name": "Fijian", "nativeName": "vosa Vakaviti"},
            {"code": "fi", "name": "Finnish", "nativeName": "suomi, suomen kieli"},
            {"code": "fr", "name": "French", "nativeName": "fran�ais, langue fran�aise"},
            {"code": "ff", "name": "Fula; Fulah; Pulaar; Pular", "nativeName": "Fulfulde, Pulaar, Pular"},
            {"code": "gl", "name": "Galician", "nativeName": "Galego"},
            {"code": "ka", "name": "Georgian", "nativeName": "???????"},
            {"code": "de", "name": "German", "nativeName": "Deutsch"},
            {"code": "el", "name": "Greek, Modern", "nativeName": "????????"},
            {"code": "gn", "name": "Guaran�", "nativeName": "Ava�e?"},
            {"code": "gu", "name": "Gujarati", "nativeName": "???????"},
            {"code": "ht", "name": "Haitian; Haitian Creole", "nativeName": "Krey�l ayisyen"},
            {"code": "ha", "name": "Hausa", "nativeName": "Hausa, ??????"},
            {"code": "he", "name": "Hebrew (modern)", "nativeName": "?????"},
            {"code": "hz", "name": "Herero", "nativeName": "Otjiherero"},
            {"code": "hi", "name": "Hindi", "nativeName": "??????, ?????"},
            {"code": "ho", "name": "Hiri Motu", "nativeName": "Hiri Motu"},
            {"code": "hu", "name": "Hungarian", "nativeName": "Magyar"},
            {"code": "ia", "name": "Interlingua", "nativeName": "Interlingua"},
            {"code": "id", "name": "Indonesian", "nativeName": "Bahasa Indonesia"},
            {
                "code": "ie",
                "name": "Interlingue",
                "nativeName": "Originally called Occidental; then Interlingue after WWII"
            },
            {"code": "ga", "name": "Irish", "nativeName": "Gaeilge"},
            {"code": "ig", "name": "Igbo", "nativeName": "As?s? Igbo"},
            {"code": "ik", "name": "Inupiaq", "nativeName": "I�upiaq, I�upiatun"},
            {"code": "io", "name": "Ido", "nativeName": "Ido"},
            {"code": "is", "name": "Icelandic", "nativeName": "�slenska"},
            {"code": "it", "name": "Italian", "nativeName": "Italiano"},
            {"code": "iu", "name": "Inuktitut", "nativeName": "??????"},
            {"code": "ja", "name": "Japanese", "nativeName": "??? (??????????)"},
            {"code": "jv", "name": "Javanese", "nativeName": "basa Jawa"},
            {"code": "kl", "name": "Kalaallisut, Greenlandic", "nativeName": "kalaallisut, kalaallit oqaasii"},
            {"code": "kn", "name": "Kannada", "nativeName": "?????"},
            {"code": "kr", "name": "Kanuri", "nativeName": "Kanuri"},
            {"code": "ks", "name": "Kashmiri", "nativeName": "???????, ???????"},
            {"code": "kk", "name": "Kazakh", "nativeName": "????? ????"},
            {"code": "km", "name": "Khmer", "nativeName": "?????????"},
            {"code": "ki", "name": "Kikuyu, Gikuyu", "nativeName": "G?k?y?"},
            {"code": "rw", "name": "Kinyarwanda", "nativeName": "Ikinyarwanda"},
            {"code": "ky", "name": "Kirghiz, Kyrgyz", "nativeName": "?????? ????"},
            {"code": "kv", "name": "Komi", "nativeName": "???? ???"},
            {"code": "kg", "name": "Kongo", "nativeName": "KiKongo"},
            {"code": "ko", "name": "Korean", "nativeName": "??? (???), ??? (???)"},
            {"code": "ku", "name": "Kurdish", "nativeName": "Kurd�, ??????"},
            {"code": "kj", "name": "Kwanyama, Kuanyama", "nativeName": "Kuanyama"},
            {"code": "la", "name": "Latin", "nativeName": "latine, lingua latina"},
            {"code": "lb", "name": "Luxembourgish, Letzeburgesch", "nativeName": "L�tzebuergesch"},
            {"code": "lg", "name": "Luganda", "nativeName": "Luganda"},
            {"code": "li", "name": "Limburgish, Limburgan, Limburger", "nativeName": "Limburgs"},
            {"code": "ln", "name": "Lingala", "nativeName": "Ling�la"},
            {"code": "lo", "name": "Lao", "nativeName": "???????"},
            {"code": "lt", "name": "Lithuanian", "nativeName": "lietuvi? kalba"},
            {"code": "lu", "name": "Luba-Katanga", "nativeName": ""},
            {"code": "lv", "name": "Latvian", "nativeName": "latvie�u valoda"},
            {"code": "gv", "name": "Manx", "nativeName": "Gaelg, Gailck"},
            {"code": "mk", "name": "Macedonian", "nativeName": "?????????? ?????"},
            {"code": "mg", "name": "Malagasy", "nativeName": "Malagasy fiteny"},
            {"code": "ms", "name": "Malay", "nativeName": "bahasa Melayu, ???? ??????"},
            {"code": "ml", "name": "Malayalam", "nativeName": "??????"},
            {"code": "mt", "name": "Maltese", "nativeName": "Malti"},
            {"code": "mi", "name": "Maori", "nativeName": "te reo M?ori"},
            {"code": "mr", "name": "Marathi", "nativeName": "?????"},
            {"code": "mh", "name": "Marshallese", "nativeName": "Kajin M?aje?"},
            {"code": "mn", "name": "Mongolian", "nativeName": "??????"},
            {"code": "na", "name": "Nauru", "nativeName": "Ekakair? Naoero"},
            {"code": "nv", "name": "Navajo, Navaho", "nativeName": "Din� bizaad, Din�k?eh?�"},
            {"code": "nb", "name": "Norwegian Bokmal", "nativeName": "Norsk bokm�l"},
            {"code": "nd", "name": "North Ndebele", "nativeName": "isiNdebele"},
            {"code": "ne", "name": "Nepali", "nativeName": "??????"},
            {"code": "ng", "name": "Ndonga", "nativeName": "Owambo"},
            {"code": "nn", "name": "Norwegian Nynorsk", "nativeName": "Norsk nynorsk"},
            {"code": "no", "name": "Norwegian", "nativeName": "Norsk"},
            {"code": "ii", "name": "Nuosu", "nativeName": "??? Nuosuhxop"},
            {"code": "nr", "name": "South Ndebele", "nativeName": "isiNdebele"},
            {"code": "oc", "name": "Occitan", "nativeName": "Occitan"},
            {"code": "oj", "name": "Ojibwe, Ojibwa", "nativeName": "????????"},
            {
                "code": "cu",
                "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
                "nativeName": "????? ??????????"
            },
            {"code": "om", "name": "Oromo", "nativeName": "Afaan Oromoo"},
            {"code": "or", "name": "Oriya", "nativeName": "?????"},
            {"code": "os", "name": "Ossetian, Ossetic", "nativeName": "???? �????"},
            {"code": "pa", "name": "Panjabi, Punjabi", "nativeName": "??????, ???????"},
            {"code": "pi", "name": "Pali", "nativeName": "????"},
            {"code": "fa", "name": "Persian", "nativeName": "?????"},
            {"code": "pl", "name": "Polish", "nativeName": "polski"},
            {"code": "ps", "name": "Pashto, Pushto", "nativeName": "????"},
            {"code": "pt", "name": "Portuguese", "nativeName": "Portugu�s"},
            {"code": "qu", "name": "Quechua", "nativeName": "Runa Simi, Kichwa"},
            {"code": "rm", "name": "Romansh", "nativeName": "rumantsch grischun"},
            {"code": "rn", "name": "Kirundi", "nativeName": "kiRundi"},
            {"code": "ro", "name": "Romanian, Moldavian, Moldovan", "nativeName": "rom�n?"},
            {"code": "ru", "name": "Russian", "nativeName": "??????? ????"},
            {"code": "sa", "name": "Sanskrit (Sa?sk?ta)", "nativeName": "?????????"},
            {"code": "sc", "name": "Sardinian", "nativeName": "sardu"},
            {"code": "sd", "name": "Sindhi", "nativeName": "??????, ????? ??????"},
            {"code": "se", "name": "Northern Sami", "nativeName": "Davvis�megiella"},
            {"code": "sm", "name": "Samoan", "nativeName": "gagana faa Samoa"},
            {"code": "sg", "name": "Sango", "nativeName": "y�ng� t� s�ng�"},
            {"code": "sr", "name": "Serbian", "nativeName": "?????? ?????"},
            {"code": "gd", "name": "Scottish Gaelic; Gaelic", "nativeName": "G�idhlig"},
            {"code": "sn", "name": "Shona", "nativeName": "chiShona"},
            {"code": "si", "name": "Sinhala, Sinhalese", "nativeName": "?????"},
            {"code": "sk", "name": "Slovak", "nativeName": "sloven?ina"},
            {"code": "sl", "name": "Slovene", "nativeName": "sloven�?ina"},
            {"code": "so", "name": "Somali", "nativeName": "Soomaaliga, af Soomaali"},
            {"code": "st", "name": "Southern Sotho", "nativeName": "Sesotho"},
            {"code": "es", "name": "Spanish; Castilian", "nativeName": "espa�ol, castellano"},
            {"code": "su", "name": "Sundanese", "nativeName": "Basa Sunda"},
            {"code": "sw", "name": "Swahili", "nativeName": "Kiswahili"},
            {"code": "ss", "name": "Swati", "nativeName": "SiSwati"},
            {"code": "sv", "name": "Swedish", "nativeName": "svenska"},
            {"code": "ta", "name": "Tamil", "nativeName": "?????"},
            {"code": "te", "name": "Telugu", "nativeName": "??????"},
            {"code": "tg", "name": "Tajik", "nativeName": "??????, to?ik?, ???????"},
            {"code": "th", "name": "Thai", "nativeName": "???"},
            {"code": "ti", "name": "Tigrinya", "nativeName": "????"},
            {"code": "bo", "name": "Tibetan Standard, Tibetan, Central", "nativeName": "???????"},
            {"code": "tk", "name": "Turkmen", "nativeName": "T�rkmen, ???????"},
            {"code": "tl", "name": "Tagalog", "nativeName": "Wikang Tagalog, ????? ??????"},
            {"code": "tn", "name": "Tswana", "nativeName": "Setswana"},
            {"code": "to", "name": "Tonga (Tonga Islands)", "nativeName": "faka Tonga"},
            {"code": "tr", "name": "Turkish", "nativeName": "T�rk�e"},
            {"code": "ts", "name": "Tsonga", "nativeName": "Xitsonga"},
            {"code": "tt", "name": "Tatar", "nativeName": "???????, tatar�a, ????????"},
            {"code": "tw", "name": "Twi", "nativeName": "Twi"},
            {"code": "ty", "name": "Tahitian", "nativeName": "Reo Tahiti"},
            {"code": "ug", "name": "Uighur, Uyghur", "nativeName": "Uy?urq?, ?????????"},
            {"code": "uk", "name": "Ukrainian", "nativeName": "??????????"},
            {"code": "ur", "name": "Urdu", "nativeName": "????"},
            {"code": "uz", "name": "Uzbek", "nativeName": "zbek, ?????, ???????"},
            {"code": "ve", "name": "Venda", "nativeName": "Tshiven?a"},
            {"code": "vi", "name": "Vietnamese", "nativeName": "Ti?ng Vi?t"},
            {"code": "vo", "name": "Volapuk", "nativeName": "Volap�k"},
            {"code": "wa", "name": "Walloon", "nativeName": "Walon"},
            {"code": "cy", "name": "Welsh", "nativeName": "Cymraeg"},
            {"code": "wo", "name": "Wolof", "nativeName": "Wollof"},
            {"code": "fy", "name": "Western Frisian", "nativeName": "Frysk"},
            {"code": "xh", "name": "Xhosa", "nativeName": "isiXhosa"},
            {"code": "yi", "name": "Yiddish", "nativeName": "??????"},
            {"code": "yo", "name": "Yoruba", "nativeName": "Yor�b�"},
            {"code": "za", "name": "Zhuang, Chuang", "nativeName": "Sa? cue??, Saw cuengh"}
        ];

        $scope.countryList = [
            {name: 'Afghanistan', code: 'AF'},
            {name: 'Aland Islands', code: 'AX'},
            {name: 'Albania', code: 'AL'},
            {name: 'Algeria', code: 'DZ'},
            {name: 'American Samoa', code: 'AS'},
            {name: 'AndorrA', code: 'AD'},
            {name: 'Angola', code: 'AO'},
            {name: 'Anguilla', code: 'AI'},
            {name: 'Antarctica', code: 'AQ'},
            {name: 'Antigua and Barbuda', code: 'AG'},
            {name: 'Argentina', code: 'AR'},
            {name: 'Armenia', code: 'AM'},
            {name: 'Aruba', code: 'AW'},
            {name: 'Australia', code: 'AU'},
            {name: 'Austria', code: 'AT'},
            {name: 'Azerbaijan', code: 'AZ'},
            {name: 'Bahamas', code: 'BS'},
            {name: 'Bahrain', code: 'BH'},
            {name: 'Bangladesh', code: 'BD'},
            {name: 'Barbados', code: 'BB'},
            {name: 'Belarus', code: 'BY'},
            {name: 'Belgium', code: 'BE'},
            {name: 'Belize', code: 'BZ'},
            {name: 'Benin', code: 'BJ'},
            {name: 'Bermuda', code: 'BM'},
            {name: 'Bhutan', code: 'BT'},
            {name: 'Bolivia', code: 'BO'},
            {name: 'Bosnia and Herzegovina', code: 'BA'},
            {name: 'Botswana', code: 'BW'},
            {name: 'Bouvet Island', code: 'BV'},
            {name: 'Brazil', code: 'BR'},
            {name: 'British Indian Ocean Territory', code: 'IO'},
            {name: 'Brunei Darussalam', code: 'BN'},
            {name: 'Bulgaria', code: 'BG'},
            {name: 'Burkina Faso', code: 'BF'},
            {name: 'Burundi', code: 'BI'},
            {name: 'Cambodia', code: 'KH'},
            {name: 'Cameroon', code: 'CM'},
            {name: 'Canada', code: 'CA'},
            {name: 'Cape Verde', code: 'CV'},
            {name: 'Cayman Islands', code: 'KY'},
            {name: 'Central African Republic', code: 'CF'},
            {name: 'Chad', code: 'TD'},
            {name: 'Chile', code: 'CL'},
            {name: 'China', code: 'CN'},
            {name: 'Christmas Island', code: 'CX'},
            {name: 'Cocos (Keeling) Islands', code: 'CC'},
            {name: 'Colombia', code: 'CO'},
            {name: 'Comoros', code: 'KM'},
            {name: 'Congo', code: 'CG'},
            {name: 'Congo, The Democratic Republic of the', code: 'CD'},
            {name: 'Cook Islands', code: 'CK'},
            {name: 'Costa Rica', code: 'CR'},
            {name: 'Cote D\'Ivoire', code: 'CI'},
            {name: 'Croatia', code: 'HR'},
            {name: 'Cuba', code: 'CU'},
            {name: 'Cyprus', code: 'CY'},
            {name: 'Czech Republic', code: 'CZ'},
            {name: 'Denmark', code: 'DK'},
            {name: 'Djibouti', code: 'DJ'},
            {name: 'Dominica', code: 'DM'},
            {name: 'Dominican Republic', code: 'DO'},
            {name: 'Ecuador', code: 'EC'},
            {name: 'Egypt', code: 'EG'},
            {name: 'El Salvador', code: 'SV'},
            {name: 'Equatorial Guinea', code: 'GQ'},
            {name: 'Eritrea', code: 'ER'},
            {name: 'Estonia', code: 'EE'},
            {name: 'Ethiopia', code: 'ET'},
            {name: 'Falkland Islands (Malvinas)', code: 'FK'},
            {name: 'Faroe Islands', code: 'FO'},
            {name: 'Fiji', code: 'FJ'},
            {name: 'Finland', code: 'FI'},
            {name: 'France', code: 'FR'},
            {name: 'French Guiana', code: 'GF'},
            {name: 'French Polynesia', code: 'PF'},
            {name: 'French Southern Territories', code: 'TF'},
            {name: 'Gabon', code: 'GA'},
            {name: 'Gambia', code: 'GM'},
            {name: 'Georgia', code: 'GE'},
            {name: 'Germany', code: 'DE'},
            {name: 'Ghana', code: 'GH'},
            {name: 'Gibraltar', code: 'GI'},
            {name: 'Greece', code: 'GR'},
            {name: 'Greenland', code: 'GL'},
            {name: 'Grenada', code: 'GD'},
            {name: 'Guadeloupe', code: 'GP'},
            {name: 'Guam', code: 'GU'},
            {name: 'Guatemala', code: 'GT'},
            {name: 'Guernsey', code: 'GG'},
            {name: 'Guinea', code: 'GN'},
            {name: 'Guinea-Bissau', code: 'GW'},
            {name: 'Guyana', code: 'GY'},
            {name: 'Haiti', code: 'HT'},
            {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
            {name: 'Holy See (Vatican City State)', code: 'VA'},
            {name: 'Honduras', code: 'HN'},
            {name: 'Hong Kong', code: 'HK'},
            {name: 'Hungary', code: 'HU'},
            {name: 'Iceland', code: 'IS'},
            {name: 'India', code: 'IN'},
            {name: 'Indonesia', code: 'ID'},
            {name: 'Iran, Islamic Republic Of', code: 'IR'},
            {name: 'Iraq', code: 'IQ'},
            {name: 'Ireland', code: 'IE'},
            {name: 'Isle of Man', code: 'IM'},
            {name: 'Israel', code: 'IL'},
            {name: 'Italy', code: 'IT'},
            {name: 'Jamaica', code: 'JM'},
            {name: 'Japan', code: 'JP'},
            {name: 'Jersey', code: 'JE'},
            {name: 'Jordan', code: 'JO'},
            {name: 'Kazakhstan', code: 'KZ'},
            {name: 'Kenya', code: 'KE'},
            {name: 'Kiribati', code: 'KI'},
            {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
            {name: 'Korea, Republic of', code: 'KR'},
            {name: 'Kuwait', code: 'KW'},
            {name: 'Kyrgyzstan', code: 'KG'},
            {name: 'Lao People\'S Democratic Republic', code: 'LA'},
            {name: 'Latvia', code: 'LV'},
            {name: 'Lebanon', code: 'LB'},
            {name: 'Lesotho', code: 'LS'},
            {name: 'Liberia', code: 'LR'},
            {name: 'Libyan Arab Jamahiriya', code: 'LY'},
            {name: 'Liechtenstein', code: 'LI'},
            {name: 'Lithuania', code: 'LT'},
            {name: 'Luxembourg', code: 'LU'},
            {name: 'Macao', code: 'MO'},
            {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
            {name: 'Madagascar', code: 'MG'},
            {name: 'Malawi', code: 'MW'},
            {name: 'Malaysia', code: 'MY'},
            {name: 'Maldives', code: 'MV'},
            {name: 'Mali', code: 'ML'},
            {name: 'Malta', code: 'MT'},
            {name: 'Marshall Islands', code: 'MH'},
            {name: 'Martinique', code: 'MQ'},
            {name: 'Mauritania', code: 'MR'},
            {name: 'Mauritius', code: 'MU'},
            {name: 'Mayotte', code: 'YT'},
            {name: 'Mexico', code: 'MX'},
            {name: 'Micronesia, Federated States of', code: 'FM'},
            {name: 'Moldova, Republic of', code: 'MD'},
            {name: 'Monaco', code: 'MC'},
            {name: 'Mongolia', code: 'MN'},
            {name: 'Montserrat', code: 'MS'},
            {name: 'Morocco', code: 'MA'},
            {name: 'Mozambique', code: 'MZ'},
            {name: 'Myanmar', code: 'MM'},
            {name: 'Namibia', code: 'NA'},
            {name: 'Nauru', code: 'NR'},
            {name: 'Nepal', code: 'NP'},
            {name: 'Netherlands', code: 'NL'},
            {name: 'Netherlands Antilles', code: 'AN'},
            {name: 'New Caledonia', code: 'NC'},
            {name: 'New Zealand', code: 'NZ'},
            {name: 'Nicaragua', code: 'NI'},
            {name: 'Niger', code: 'NE'},
            {name: 'Nigeria', code: 'NG'},
            {name: 'Niue', code: 'NU'},
            {name: 'Norfolk Island', code: 'NF'},
            {name: 'Northern Mariana Islands', code: 'MP'},
            {name: 'Norway', code: 'NO'},
            {name: 'Oman', code: 'OM'},
            {name: 'Pakistan', code: 'PK'},
            {name: 'Palau', code: 'PW'},
            {name: 'Palestinian Territory, Occupied', code: 'PS'},
            {name: 'Panama', code: 'PA'},
            {name: 'Papua New Guinea', code: 'PG'},
            {name: 'Paraguay', code: 'PY'},
            {name: 'Peru', code: 'PE'},
            {name: 'Philippines', code: 'PH'},
            {name: 'Pitcairn', code: 'PN'},
            {name: 'Poland', code: 'PL'},
            {name: 'Portugal', code: 'PT'},
            {name: 'Puerto Rico', code: 'PR'},
            {name: 'Qatar', code: 'QA'},
            {name: 'Reunion', code: 'RE'},
            {name: 'Romania', code: 'RO'},
            {name: 'Russian Federation', code: 'RU'},
            {name: 'RWANDA', code: 'RW'},
            {name: 'Saint Helena', code: 'SH'},
            {name: 'Saint Kitts and Nevis', code: 'KN'},
            {name: 'Saint Lucia', code: 'LC'},
            {name: 'Saint Pierre and Miquelon', code: 'PM'},
            {name: 'Saint Vincent and the Grenadines', code: 'VC'},
            {name: 'Samoa', code: 'WS'},
            {name: 'San Marino', code: 'SM'},
            {name: 'Sao Tome and Principe', code: 'ST'},
            {name: 'Saudi Arabia', code: 'SA'},
            {name: 'Senegal', code: 'SN'},
            {name: 'Serbia and Montenegro', code: 'CS'},
            {name: 'Seychelles', code: 'SC'},
            {name: 'Sierra Leone', code: 'SL'},
            {name: 'Singapore', code: 'SG'},
            {name: 'Slovakia', code: 'SK'},
            {name: 'Slovenia', code: 'SI'},
            {name: 'Solomon Islands', code: 'SB'},
            {name: 'Somalia', code: 'SO'},
            {name: 'South Africa', code: 'ZA'},
            {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
            {name: 'Spain', code: 'ES'},
            {name: 'Sri Lanka', code: 'LK'},
            {name: 'Sudan', code: 'SD'},
            {name: 'Suriname', code: 'SR'},
            {name: 'Svalbard and Jan Mayen', code: 'SJ'},
            {name: 'Swaziland', code: 'SZ'},
            {name: 'Sweden', code: 'SE'},
            {name: 'Switzerland', code: 'CH'},
            {name: 'Syrian Arab Republic', code: 'SY'},
            {name: 'Taiwan, Province of China', code: 'TW'},
            {name: 'Tajikistan', code: 'TJ'},
            {name: 'Tanzania, United Republic of', code: 'TZ'},
            {name: 'Thailand', code: 'TH'},
            {name: 'Timor-Leste', code: 'TL'},
            {name: 'Togo', code: 'TG'},
            {name: 'Tokelau', code: 'TK'},
            {name: 'Tonga', code: 'TO'},
            {name: 'Trinidad and Tobago', code: 'TT'},
            {name: 'Tunisia', code: 'TN'},
            {name: 'Turkey', code: 'TR'},
            {name: 'Turkmenistan', code: 'TM'},
            {name: 'Turks and Caicos Islands', code: 'TC'},
            {name: 'Tuvalu', code: 'TV'},
            {name: 'Uganda', code: 'UG'},
            {name: 'Ukraine', code: 'UA'},
            {name: 'United Arab Emirates', code: 'AE'},
            {name: 'United Kingdom', code: 'GB'},
            {name: 'United States', code: 'US'},
            {name: 'United States Minor Outlying Islands', code: 'UM'},
            {name: 'Uruguay', code: 'UY'},
            {name: 'Uzbekistan', code: 'UZ'},
            {name: 'Vanuatu', code: 'VU'},
            {name: 'Venezuela', code: 'VE'},
            {name: 'Viet Nam', code: 'VN'},
            {name: 'Virgin Islands, British', code: 'VG'},
            {name: 'Virgin Islands, U.S.', code: 'VI'},
            {name: 'Wallis and Futuna', code: 'WF'},
            {name: 'Western Sahara', code: 'EH'},
            {name: 'Yemen', code: 'YE'},
            {name: 'Zambia', code: 'ZM'},
            {name: 'Zimbabwe', code: 'ZW'}
        ];

        $scope.sipUserList = [];

        $scope.selectedSipUser = {
        	id: ""
		};

        $scope.displayVeeryContact = '';

        var genDayList = function () {
            var max = 31;

            var dayArr = [];

            for (min = 1; min <= max; min++) {
                dayArr.push(min);
            }

            return dayArr;
        };

        $scope.dayList = genDayList();


        $scope.monthList = [
            {index: 1, name: "January"},
            {index: 2, name: "February"},
            {index: 3, name: "March"},
            {index: 4, name: "April"},
            {index: 5, name: "May"},
            {index: 6, name: "June"},
            {index: 7, name: "July"},
            {index: 8, name: "August"},
            {index: 9, name: "September"},
            {index: 10, name: "October"},
            {index: 11, name: "November"},
            {index: 12, name: "December"}

        ];

        $scope.maxYear = moment().year();

        var resetPage = function () {
            $scope.sipUserList = [];

            $scope.selectedSipUser = {
            	id: ""
			};

            $scope.displayVeeryContact = '';

            $scope.newContact = {};
            $scope.NewContactLabel = "New";

            $scope.displayAddress = '';
            $scope.displayEmail = '';
            $scope.displayPhoneNumber = '';
            $scope.displayName = '';

            $scope.contactsActive = '';
            $scope.infoActive = 'active';

            $scope.NewContactOpened = false;

            $scope.CurrentTab = 'Info';

            loadProfile($stateParams.username);
            //loadProfile($scope.CurrentProfile.username);
            loadSipUsers();

        };

        $scope.editProfileImage = function () {
            if ($scope.isEditState) {
                $scope.showProfilePicModal();
            }

        };
        $scope.snapProfileImage = function () {
            $scope.showSnapPicModal();
        };
        $scope.changeAvatarURL = function (fileID) {

            if (fileID) {
                $scope.CurrentProfile.avatar = baseUrls.fileServiceInternalUrl + "File/Download/" + $scope.tenant + "/" + $scope.company + "/" + fileID + "/ProPic";
                $scope.saveProfile();
            }


        }

        $scope.showProfilePicModal = function () {
            //modal show
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/userprofile/partials/ProfilePicUploadModal.html',
                controller: 'profilePicUploadController',
                size: 'lg',
                resolve: {
                    changeUrl: function () {
                        return $scope.changeAvatarURL;
                    }
                }
            });
        };
        $scope.showSnapPicModal = function () {
            //modal show
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/userprofile/partials/SnapUploadModal.html',
                controller: 'snapUploadController',
                size: 'lg',
                resolve: {
                    changeUrl: function () {
                        return $scope.changeAvatarURL;
                    }
                }
            });
        };

        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.newContact = {};
        $scope.NewContactLabel = "New";

        $scope.displayAddress = '';
        $scope.displayEmail = '';
        $scope.displayPhoneNumber = '';
        $scope.displayName = '';

        $scope.contactsActive = '';
        $scope.infoActive = 'active';

        $scope.NewContactOpened = false;

        $scope.CurrentTab = 'Info';

        $scope.editProfilePress = function () {
            $scope.contactsActive = '';
            $scope.infoActive = 'active';
            $scope.CurrentTab = 'Info';
            $scope.isEditState = true;
        };

        $scope.tabClick = function (tab) {
            $scope.CurrentTab = tab;

            if (tab === 'Contacts') {
                $scope.contactsActive = 'active';
                $scope.infoActive = '';
            }
            else if (tab === 'Info') {
                $scope.contactsActive = '';
                $scope.infoActive = 'active';
            }
        };

        $scope.addContactPress = function () {
            $scope.NewContactOpened = !$scope.NewContactOpened;

            if ($scope.NewContactLabel === 'New') {
                $scope.NewContactLabel = 'Cancel';
            }
            else if ($scope.NewContactLabel === 'Cancel') {
                $scope.NewContactLabel = 'New';
            }


        };


        $scope.isShowToken = false;
        $scope.isResetPawssord = false;
        $scope.resetUserPassword = function () {
            $scope.isResetPawssord = true;
            userProfileApiAccess.resetProfilePassword($stateParams.username).then(function (data) {
                $scope.isResetPawssord = false;
                if (data.IsSuccess) {
                    if (data.Result) {
                        $scope.isShowToken = true;
                        $scope.resetToken = data.Result;
                    } else {

                        $scope.showAlert('Error', 'error', "no data found");
                    }
                }


            }, function (err) {
                $scope.showAlert('Error', 'error', err.message);
            });
        };

        //close pwd token window
        $scope.pwdTokenClose = function () {
            $scope.isShowToken = false;
        };

        //copy pwd token window
        $scope.copyToken = function () {

            var $tempInput = $("<textarea>");
            $("body").append($tempInput);
            $tempInput.val($scope.resetToken).select();
            document.execCommand("copy");
            $tempInput.remove();
            $scope.showAlert('Success', 'success', 'Token copied successfully');
        };


        $scope.saveProfile = function () {

            $scope.isEditState = false;
            var filteredUsers = $scope.sipUserList.filter(function (item) {
                if (item.id == $scope.selectedSipUser.id) {
                    return true;
                }
                else {
                    return false;
                }

            });

            var curUser = null;

            if (filteredUsers && filteredUsers.length > 0 && filteredUsers[0].SipUsername && filteredUsers[0].CloudEndUser && filteredUsers[0].CloudEndUser.Domain) {
                curUser = filteredUsers[0];
                $scope.CurrentProfile.veeryaccount = {};
                $scope.CurrentProfile.veeryaccount.contact = filteredUsers[0].SipUsername + '@' + filteredUsers[0].CloudEndUser.Domain;

                if (filteredUsers[0].Extension && filteredUsers[0].Extension.Extension) {
                    $scope.CurrentProfile.veeryaccount.display = filteredUsers[0].Extension.Extension;
                }

                $scope.CurrentProfile.veeryaccount.verified = true;
                $scope.CurrentProfile.veeryaccount.type = 'sip';

            }
            userProfileApiAccess.updateProfile($scope.CurrentProfile.username, $scope.CurrentProfile).then(function (data) {
                if (data.IsSuccess) {

                    if (curUser) {
                        curUser.GuRefId = $scope.CurrentProfile._id;

                        sipUserApiHandler.updateUser(curUser);
                    }
                    $scope.isEditState = false;

                    if($scope.CurrentProfile.mapToResource){

                        resourceService.SaveResource({ResourceName: $scope.CurrentProfile.username}).then(function (response) {
                            if (response.IsSuccess) {

                                resourceService.SetResourceToProfile($scope.CurrentProfile.username, response.Result.ResourceId).then(function (mappingStatus) {
                                    if (mappingStatus) {
                                        $scope.showAlert('Success', 'success', 'User profile updated successfully');
                                        $scope.showAlert("Map To Resource", "info", "Resource " + response.Result.ResourceName + " Successfully Save.");
                                        resetPage();
                                    }
                                    else {
                                        $scope.showAlert('Success', 'success', 'User profile updated successfully');
                                        $scope.showAlert("Map To Resource", "warn", "Resource " + response.Result.ResourceName + " Save Successfully Without Mapping to Profile.");
                                        resetPage();
                                    }
                                }, function (error) {
                                    $scope.showAlert('Success', 'success', 'User profile updated successfully');
                                    $scope.showAlert("Map To Resource", "error", "Fail To Map Resource with Profile.");
                                    resetPage();
                                });
                            }
                            else {
                                if (response.CustomMessage == "invalid Resource Name.") {
                                    $scope.showAlert('Success', 'success', 'User profile updated successfully');
                                    $scope.showAlert("Map To Resource", "error", "Invalid Resource Name.");
                                    resetPage();
                                }else{
                                    $scope.showAlert('Success', 'success', 'User profile updated successfully');
                                    resetPage();
                                }
                            }

                        }, function (error) {
                            $scope.showAlert('Success', 'success', 'User profile updated successfully');
                            $scope.showAlert('Map To Resource', 'error', 'Failed to map user to resource');
                            resetPage();
                        });

                    }else {

                        $scope.showAlert('Success', 'success', 'User profile updated successfully');
                        resetPage();
                    }
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while saving profile";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });

        };

        var loadSipUsers = function () {
            sipUserApiHandler.getSIPUsers().then(function (data) {
                if (data.IsSuccess) {
                    if (data.Result) {
                        $scope.sipUserList = data.Result;

                    }
                }

            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        $scope.CurrentProfile = {
            allowoutbound : true
        };


        var loadProfile = function (username) {
            userProfileApiAccess.getProfileByName(username).then(function (data) {
                if (data.IsSuccess) {
                    $scope.CurrentProfile = data.Result;

                    $scope.checkAvailability();

                    if (data.Result) {
                        if (data.Result.address) {
                            $scope.displayAddress = data.Result.address.city + ' , ' + data.Result.address.province + ' , ' + data.Result.address.country;
                        }

                        if(data.Result.allowoutbound === null || data.Result.allowoutbound === undefined)
                        {
                            $scope.CurrentProfile.allowoutbound = true;
                        }

                        if (data.Result.veeryaccount && data.Result.veeryaccount.contact) {
                            $scope.displayVeeryContact = data.Result.veeryaccount.display + ' | ' + data.Result.veeryaccount.contact;
                        }
                        else {
                            $scope.displayVeeryContact = 'Veery contact not configured yet';
                        }

                        if (data.Result.email) {
                            $scope.displayEmail = data.Result.email.contact;
                        }

                        if (data.Result.phoneNumber) {
                            $scope.displayPhoneNumber = data.Result.phoneNumber.contact;
                        }

                        if (data.Result.firstname) {
                            $scope.displayName = data.Result.firstname;
                        }

                        if (data.Result.lastname) {
                            $scope.displayName = $scope.displayName + ' ' + data.Result.lastname;
                        }


                        if (data.Result.birthday) {
                            var momentUtc = moment(data.Result.birthday).utc();

                            data.Result.dob = {};
                            data.Result.dob.day = momentUtc.date().toString();
                            data.Result.dob.month = (momentUtc.month() + 1).toString();
                            data.Result.dob.year = momentUtc.year();


                        }
                        else {

                            data.Result.dob = {};
                            data.Result.dob.day = moment().date().toString();
                            data.Result.dob.month = (moment().month() + 1).toString();
                            data.Result.dob.year = moment().year();
                        }

                    }


                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while getting profile";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.addNewContact = function () {
            userProfileApiAccess.addContactToProfile($scope.CurrentProfile.username, $scope.newContact.Contact, $scope.newContact.Type).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'success', 'Contact added');

                    userProfileApiAccess.getProfileByName($scope.CurrentProfile.username).then(function (data1) {
                        if (data1.IsSuccess) {
                            $scope.CurrentProfile.contacts = data1.Result.contacts;
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Error', 'error', errMsg);

                        }

                    }, function (err) {
                        var errMsg = "Error occurred while loading new contact list";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    });


                }
                else {
                    $scope.showAlert('Error', 'error', 'Error adding contact');
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error updating user";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };


        $scope.removeContact = function (contact) {
            userProfileApiAccess.deleteContactFromProfile($scope.CurrentProfile.username, contact).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'success', 'Contact added');

                    userProfileApiAccess.getProfileByName($scope.CurrentProfile.username).then(function (data1) {
                        if (data1.IsSuccess) {
                            $scope.CurrentProfile.contacts = data1.Result.contacts;
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Error', 'error', errMsg);

                        }

                    }, function (err) {
                        loginService.isCheckResponse(err);
                        var errMsg = "Error occurred while loading new contact list";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    });


                }
                else {
                    $scope.showAlert('Error', 'error', 'Error deleting contact');
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while deleting contact";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });

        }

        loadProfile($stateParams.username);
        loadSipUsers();


        //Map Resource To User

        $scope.resourceAvailableToMap = false;
        $scope.checkAvailability = function () {
            resourceService.ResourceIsExists($stateParams.username).then(function (resResponse) {
                if(!resResponse.IsSuccess) {
                    $scope.resourceAvailableToMap = false;
                }else {
                    $scope.resourceAvailableToMap = true;
                    $scope.activeResourceAccount = "Resource: "+ $scope.CurrentProfile.resourceid
                }
            }, function (error) {
                $scope.resourceAvailableToMap = false;
                $scope.showAlert("Map To Resource", "error", "Check resource availability failed");
            });
        };



    };

    app.controller("userProfileCtrl", userProfileCtrl);
}());
(function () {
    var app = angular.module("veeryConsoleApp");

    var profilePicUploadController = function ($scope, $stateParams, $filter, $uibModalInstance, $base64, $http, FileUploader, fileService, authService, changeUrl, jwtHelper) {

        $scope.showModal = true;
        $scope.isUploadDisable = true;

        $scope.myImage = '';
        $scope.myCroppedImage = '';


        $scope.tenant = 0;
        $scope.company = 0;
        $scope.getCompanyTenant = function () {
            var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());
            console.info(decodeData);
            $scope.company = decodeData.company;
            $scope.tenant = decodeData.tenant;
        };
        $scope.getCompanyTenant();


        $scope.myChannel = {
            // the fields below are all optional
            videoHeight: 400,
            videoWidth: 300,
            video: null // Will reference the video element on success
        };

        var _video = null,
            patData = null;

        $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

        $scope.channel = {};

        $scope.webcamError = false;
        $scope.onError = function (err) {
            $scope.$apply(
                function () {
                    $scope.webcamError = err;
                }
            );
        };
        $scope.onSuccess = function () {
            // The video element contains the captured camera data
            _video = $scope.myChannel.video;
            $scope.$apply(function () {
                $scope.patOpts.w = _video.width;
                $scope.patOpts.h = _video.height;

            });
        };

        $scope.snapURI = "";

        $scope.makeSnapshot = function makeSnapshot() {
            if (_video) {
                var patCanvas = document.querySelector('#snapshot');
                if (!patCanvas) return;

                patCanvas.width = _video.width;
                patCanvas.height = _video.height;
                var ctxPat = patCanvas.getContext('2d');

                var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
                ctxPat.putImageData(idata, 0, 0);


                $scope.snapURI = patCanvas.toDataURL();


                patData = idata;

            }
        };

        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = _video.width;
            hiddenCanvas.height = _video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, _video.width, _video.height);
            return ctx.getImageData(x, y, w, h);
        };


        $scope.file = {};
        $scope.file.Category = "PROFILE_PICTURES";
        var uploader = $scope.uploader = new FileUploader({
            url: fileService.UploadUrl,
            headers: fileService.Headers
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });


        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (item) {
            console.info('onAfterAddingFile', item);

            if (item.file.type.split("/")[0] == "image") {
                //fileItem.upload();


                item.croppedImage = '';

                var reader = new FileReader();
                reader.onload = function (event) {
                    $scope.$apply(function () {
                        item.image = event.target.result;
                    });
                };
                reader.readAsDataURL(item._file);
                $scope.isUploadDisable = false;

            }
            else {
                new PNotify({
                    title: 'Profile picture upload',
                    text: 'Invalid File type. Retry',
                    type: 'error',
                    styling: 'bootstrap3'
                });
            }

        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            if (!$scope.file.Category) {
                uploader.clearQueue();
                new PNotify({
                    title: 'File Upload!',
                    text: 'Invalid File Category.',
                    type: 'error',
                    styling: 'bootstrap3'
                });
                return;
            }
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            var blob = dataURItoBlob(item.croppedImage);
            item._file = blob;
            item.formData.push({'fileCategory': 'PROFILE_PICTURES'});
        };

        var dataURItoBlob = function (dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: mimeString});
        };

        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            console.log("result ", response.Result);
            new PNotify({
                title: 'File Upload!',
                text: "Picture uploaded successfully",
                type: 'success',
                styling: 'bootstrap3'
            });

            changeUrl(response.Result);
            $uibModalInstance.dismiss('cancel');

        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };


        $scope.clearQueue = function () {

            uploader.clearQueue();
            $scope.isUploadDisable = true;
            document.getElementById("cropedArea").src = "";
        }
        $scope.showMe = function () {
            alert("showMe");


            var blob = dataURItoBlob($scope.newConverted);
            var fd = new FormData(document.forms[0]);
            fd.append("file", blob);

            $http.post(fileService.UploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                changeUrl(response.Result);
                $uibModalInstance.dismiss('cancel');
            }).error(function (error) {
                alert(error);
                console.log("error")
            });


            /*



             convertURIToImageData($scope.myCroppedImage).then(function (imageData) {
             // Here you can use imageData
             console.log(imageData);
             });
             */

            /*var resultImage= new Image($scope.)*/
        }


        $scope.ok = function () {

            $uibModalInstance.close($scope.password);
        };

        $scope.loginPhone = function () {

            $uibModalInstance.close($scope.password);
        };

        $scope.closeModal = function () {

            $uibModalInstance.dismiss('cancel');
        };

        $scope.cancel = function () {

            $uibModalInstance.dismiss('cancel');
        };

        /*var handleFileSelect=function() {
         var file=evt.currentTarget.files[0];
         var reader = new FileReader();
         reader.onload = function (evt) {
         $scope.$apply(function($scope){
         $scope.myImage="C:/Users/Pawan/Downloads/MyMan(new).jpg";
         });
         };
         //reader.readAsDataURL(file);

         $scope.myImage="https://avatars1.githubusercontent.com/u/10277006?v=3&s=460";

         };
         //angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
         handleFileSelect();*/

        var b64ToUint6 = function (nChr) {
            // convert base64 encoded character to 6-bit integer
            // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
            return nChr > 64 && nChr < 91 ? nChr - 65
                : nChr > 96 && nChr < 123 ? nChr - 71
                    : nChr > 47 && nChr < 58 ? nChr + 4
                        : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
        }


        var base64DecToArr = function (sBase64, nBlocksSize) {
            // convert base64 encoded string to Uintarray
            // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
            var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
                nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
                taBytes = new Uint8Array(nOutLen);

            for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                nMod4 = nInIdx & 3;
                nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                if (nMod4 === 3 || nInLen - nInIdx === 1) {
                    for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                    }
                    nUint24 = 0;
                }
            }
            return taBytes;
        }


        $scope.uploadSnap = function (dataURI) {


            var form_elem_name = "mySnap";
            var image_fmt = '';
            if (dataURI.match(/^data\:image\/(\w+)/))
                image_fmt = RegExp.$1;
            else
                throw "Cannot locate image format in Data URI";

            var raw_image_data = dataURI.replace(/^data\:image\/\w+\;base64\,/, '');
            var http = new XMLHttpRequest();

            http.open("POST", fileService.UploadUrl, true);
            http.setRequestHeader('Authorization', authService.GetToken());

            if (http.upload && http.upload.addEventListener) {
                http.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        var progress = e.loaded / e.total;
                        // Webcam.dispatch('uploadProgress', progress, e);
                        console.log("Proressing ", progress);
                    }
                }, false);
            }

            // completion handler
            var self = this;
            http.onload = function (text) {

                new PNotify({
                    title: 'Your Profile picture ',
                    text: "Picture has been changed successfully",
                    type: 'success',
                    styling: 'bootstrap3'
                });

                changeUrl(JSON.parse(text.currentTarget.response).Result);
                $uibModalInstance.dismiss('cancel');
            };

            // create a blob and decode our base64 to binary
            var blob = new Blob([base64DecToArr(raw_image_data)], {type: 'image/' + image_fmt});

            // stuff into a form, so servers can easily receive it as a standard file upload
            var form = new FormData();
            form.append(form_elem_name, blob, form_elem_name + "." + image_fmt.replace(/e/, ''));
            form.append('fileCategory', 'PROFILE_PICTURES');

            // send data to server
            http.send(form);


            /*var blobSnap=dataURItoBlob(dataURI);
             var formData = new FormData();
             var snapFile= new File([""], "snapUploadFile");
             snapFile.fileCategory='PROFILE_PICTURES';
             snapFile._file=blobSnap;

             return $http({
             method: 'POST',
             url: fileService.UploadUrl,
             data:snapFile
             }).then(function(response)
             {
             if(response.data.IsSuccess)
             {
             new PNotify({
             title: 'File Upload!',
             text: "Picture uploaded successfully",
             type: 'success',
             styling: 'bootstrap3'
             });

             changeUrl(response.Result);
             $uibModalInstance.dismiss('cancel');
             }
             });*/


        }


        /* var dataURItoBlob = function(dataURI) {
         var binary = atob(dataURI.split(',')[1]);
         var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
         var array = [];
         for(var i = 0; i < binary.length; i++) {
         array.push(binary.charCodeAt(i));
         }
         return new Blob([new Uint8Array(array)], {type: mimeString});
         };*/


        var convertURIToImageData = function (URI) {
            return new Promise(function (resolve, reject) {
                if (URI == null) return reject();
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    image = new Image();
                image.addEventListener('load', function () {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve(context.getImageData(0, 0, canvas.width, canvas.height));
                }, false);
                image.src = URI;
                $scope.newConverted = image.src;


                var imageType = (URI.split(";")[0]).split(":")[1];
                var imagefromat = ((URI.split(";")[0]).split(":")[1]).split("/")[1];
                var imageName = "newProfilePic." + imagefromat;

                var blob = new Blob([URI], {type: imageType});
                //var NewCroppedfile = new File([blob], imageName,{type: imageType,lastModified:new Date()});
                console.log("File date ", blob);


                var fd = new FormData();
                fd.append('file', blob);

                $http.post(fileService.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function (response) {
                    changeUrl(response.Result);
                    $uibModalInstance.dismiss('cancel');
                }).error(function (error) {
                    alert(error);
                    console.log("error")
                });


                /* $scope.uploadCropped(NewCroppedfile).then(function (response) {
                 console.log(response);
                 })*/


                /*if( uploader.queue.length>0)
                 {
                 uploader.clearQueue();
                 }


                 var newFile= new FileUploader.FileItem(uploader,file);
                 console.log("new FileData ",newFile);
                 //uploader.queue.push(newFile);
                 newFile.progress = 100;
                 newFile.isUploaded = true;
                 newFile.isSuccess = true;
                 uploader.queue.push(newFile);
                 console.log("New Queue ",uploader.queue);

                 /!*
                 alert(uploader.queue.length);
                 angular.forEach(uploader.queue, function (item) {
                 item.upload();
                 });
                 *!/
                 uploader.queue[0].upload();*/

                //uploader.queue[0].upload();
                //uploader.uploadItem($scope.newConverted);

            });

            //var URI = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAABsiqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/iKC3/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/2uLp///////R2uP/dZGs/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/////////////////+3w9P+IoLf/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv///////////+3w9P+tvc3/dZGs/2yKpv9siqb/bIqm/2yKpv9siqb/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH////////////0+Pv/erDR/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB//////////////////////96sNH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf////////////////+Ft9T/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/E4zV/xOM1f8TjNX/E4zV/yKT2P/T6ff/////////////////4fH6/z+i3f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f+m1O/////////////////////////////w+Pz/IpPY/xOM1f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f8TjNX////////////T6ff/Tqng/6bU7////////////3u/5/8TjNX/E4zV/xOM1f8TjNX/AIv//wCL//8Ai///AIv/////////////gMX//wCL//8gmv////////////+Axf//AIv//wCL//8Ai///AIv//wCL//8Ai///AIv//wCL///v+P///////+/4//+Axf//z+n/////////////YLf//wCL//8Ai///AIv//wCL//8Ai///AIv//wCL//8Ai///gMX/////////////////////////////z+n//wCL//8Ai///AIv//wCL//8Ai///AHr//wB6//8Aev//AHr//wB6//+Avf//7/f/////////////v97//xCC//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

        };

        $scope.uploadCropped = function (file) {
            return $http({
                method: 'POST',
                url: fileService.UploadUrl,
                data: file
            }).then(function (response) {
                return response;
            });

        }
    };

    app.controller("profilePicUploadController", profilePicUploadController);
}());
(function () {
    var app = angular.module("veeryConsoleApp");

    var snapUploadController = function ($scope, $stateParams, $filter, $uibModalInstance, $base64, $http, FileUploader, fileService, authService, changeUrl, jwtHelper) {

        $scope.showSnapModal = true;


        /*     $scope.isUploadDisable=true;

         $scope.myImage = '';
         $scope.myCroppedImage = '';


         $scope.tenant = 0;
         $scope.company = 0;
         $scope.getCompanyTenant = function () {
         var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());
         console.info(decodeData);
         $scope.company = decodeData.company;
         $scope.tenant = decodeData.tenant;
         };
         $scope.getCompanyTenant();


         $scope.file = {};
         $scope.file.Category = "PROFILE_PICTURES";
         var uploader = $scope.uploader = new FileUploader({
         url: fileService.UploadUrl,
         headers: fileService.Headers
         });

         // FILTERS

         uploader.filters.push({
         name: 'imageFilter',
         fn: function(item /!*{File|FileLikeObject}*!/, options) {
         var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
         return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
         }
         });


         // CALLBACKS

         uploader.onWhenAddingFileFailed = function (item /!*{File|FileLikeObject}*!/, filter, options) {
         console.info('onWhenAddingFileFailed', item, filter, options);
         };
         uploader.onAfterAddingFile = function (item) {
         console.info('onAfterAddingFile', item);

         if (item.file.type.split("/")[0] == "image") {
         //fileItem.upload();


         item.croppedImage = '';

         var reader = new FileReader();
         reader.onload = function(event) {
         $scope.$apply(function(){
         item.image = event.target.result;
         });
         };
         reader.readAsDataURL(item._file);
         $scope.isUploadDisable=false;

         }
         else {
         new PNotify({
         title: 'Profile picture upload',
         text: 'Invalid File type. Retry',
         type: 'error',
         styling: 'bootstrap3'
         });
         }

         };
         uploader.onAfterAddingAll = function (addedFileItems) {
         if (!$scope.file.Category) {
         uploader.clearQueue();
         new PNotify({
         title: 'File Upload!',
         text: 'Invalid File Category.',
         type: 'error',
         styling: 'bootstrap3'
         });
         return;
         }
         console.info('onAfterAddingAll', addedFileItems);
         };
         uploader.onBeforeUploadItem = function (item) {
         console.info('onBeforeUploadItem', item);
         var blob = dataURItoBlob(item.croppedImage);
         item._file = blob;
         };

         var dataURItoBlob = function(dataURI) {
         var binary = atob(dataURI.split(',')[1]);
         var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
         var array = [];
         for(var i = 0; i < binary.length; i++) {
         array.push(binary.charCodeAt(i));
         }
         return new Blob([new Uint8Array(array)], {type: mimeString});
         };

         uploader.onProgressItem = function (fileItem, progress) {
         console.info('onProgressItem', fileItem, progress);
         };
         uploader.onProgressAll = function (progress) {
         console.info('onProgressAll', progress);
         };
         uploader.onSuccessItem = function (fileItem, response, status, headers) {
         console.info('onSuccessItem', fileItem, response, status, headers);
         };
         uploader.onErrorItem = function (fileItem, response, status, headers) {
         console.info('onErrorItem', fileItem, response, status, headers);
         };
         uploader.onCancelItem = function (fileItem, response, status, headers) {
         console.info('onCancelItem', fileItem, response, status, headers);
         };
         uploader.onCompleteItem = function (fileItem, response, status, headers) {
         console.info('onCompleteItem', fileItem, response, status, headers);
         console.log("result ", response.Result);
         new PNotify({
         title: 'File Upload!',
         text: "Picture uploaded successfully",
         type: 'success',
         styling: 'bootstrap3'
         });

         changeUrl(response.Result);
         $uibModalInstance.dismiss('cancel');

         };
         uploader.onCompleteAll = function () {
         console.info('onCompleteAll');
         };



         $scope.clearQueue = function () {

         uploader.clearQueue();
         $scope.isUploadDisable=true;
         document.getElementById("cropedArea").src="";
         }
         $scope.showMe = function () {
         alert("showMe");



         var blob = dataURItoBlob($scope.newConverted);
         var fd = new FormData(document.forms[0]);
         fd.append("file", blob);

         $http.post(fileService.UploadUrl, fd, {
         transformRequest: angular.identity,
         headers: {
         'Content-Type': undefined
         }
         }).success(function(response){
         changeUrl(response.Result);
         $uibModalInstance.dismiss('cancel');
         }).error(function(error){
         alert(error);
         console.log("error")
         });




         /!*



         convertURIToImageData($scope.myCroppedImage).then(function (imageData) {
         // Here you can use imageData
         console.log(imageData);
         });
         *!/

         /!*var resultImage= new Image($scope.)*!/
         }


         $scope.ok = function () {

         $uibModalInstance.close($scope.password);
         };

         $scope.loginPhone = function () {

         $uibModalInstance.close($scope.password);
         };

         $scope.closeModal = function () {

         $uibModalInstance.dismiss('cancel');
         };

         $scope.cancel = function () {

         $uibModalInstance.dismiss('cancel');
         };

         /!*var handleFileSelect=function() {
         var file=evt.currentTarget.files[0];
         var reader = new FileReader();
         reader.onload = function (evt) {
         $scope.$apply(function($scope){
         $scope.myImage="C:/Users/Pawan/Downloads/MyMan(new).jpg";
         });
         };
         //reader.readAsDataURL(file);

         $scope.myImage="https://avatars1.githubusercontent.com/u/10277006?v=3&s=460";

         };
         //angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
         handleFileSelect();*!/



         var dataURItoBlob = function(dataURI) {
         var binary = atob(dataURI.split(',')[1]);
         var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
         var array = [];
         for(var i = 0; i < binary.length; i++) {
         array.push(binary.charCodeAt(i));
         }
         return new Blob([new Uint8Array(array)], {type: mimeString});
         };








         var convertURIToImageData = function(URI) {
         return new Promise(function (resolve, reject) {
         if (URI == null) return reject();
         var canvas = document.createElement('canvas'),
         context = canvas.getContext('2d'),
         image = new Image();
         image.addEventListener('load', function () {
         canvas.width = image.width;
         canvas.height = image.height;
         context.drawImage(image, 0, 0, canvas.width, canvas.height);
         resolve(context.getImageData(0, 0, canvas.width, canvas.height));
         }, false);
         image.src = URI;
         $scope.newConverted=image.src;


         var imageType=(URI.split(";")[0]).split(":")[1];
         var imagefromat=((URI.split(";")[0]).split(":")[1]).split("/")[1];
         var imageName="newProfilePic."+imagefromat;

         var blob = new Blob([URI], {type: imageType});
         //var NewCroppedfile = new File([blob], imageName,{type: imageType,lastModified:new Date()});
         console.log("File date ",blob);




         var fd = new FormData();
         fd.append('file', blob);

         $http.post(fileService.UploadUrl, fd, {
         transformRequest: angular.identity,
         headers: {
         'Content-Type': undefined
         }
         }).success(function(response){
         changeUrl(response.Result);
         $uibModalInstance.dismiss('cancel');
         }).error(function(error){
         alert(error);
         console.log("error")
         });


         /!* $scope.uploadCropped(NewCroppedfile).then(function (response) {
         console.log(response);
         })*!/




         /!*if( uploader.queue.length>0)
         {
         uploader.clearQueue();
         }


         var newFile= new FileUploader.FileItem(uploader,file);
         console.log("new FileData ",newFile);
         //uploader.queue.push(newFile);
         newFile.progress = 100;
         newFile.isUploaded = true;
         newFile.isSuccess = true;
         uploader.queue.push(newFile);
         console.log("New Queue ",uploader.queue);

         /!*
         alert(uploader.queue.length);
         angular.forEach(uploader.queue, function (item) {
         item.upload();
         });
         *!/
         uploader.queue[0].upload();*!/

         //uploader.queue[0].upload();
         //uploader.uploadItem($scope.newConverted);

         });

         //var URI = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAABsiqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/iKC3/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/2uLp///////R2uP/dZGs/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/////////////////+3w9P+IoLf/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv///////////+3w9P+tvc3/dZGs/2yKpv9siqb/bIqm/2yKpv9siqb/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH////////////0+Pv/erDR/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB//////////////////////96sNH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf////////////////+Ft9T/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/E4zV/xOM1f8TjNX/E4zV/yKT2P/T6ff/////////////////4fH6/z+i3f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f+m1O/////////////////////////////w+Pz/IpPY/xOM1f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f8TjNX////////////T6ff/Tqng/6bU7////////////3u/5/8TjNX/E4zV/xOM1f8TjNX/AIv//wCL//8Ai///AIv/////////////gMX//wCL//8gmv////////////+Axf//AIv//wCL//8Ai///AIv//wCL//8Ai///AIv//wCL///v+P///////+/4//+Axf//z+n/////////////YLf//wCL//8Ai///AIv//wCL//8Ai///AIv//wCL//8Ai///gMX/////////////////////////////z+n//wCL//8Ai///AIv//wCL//8Ai///AHr//wB6//8Aev//AHr//wB6//+Avf//7/f/////////////v97//xCC//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

         };

         $scope.uploadCropped = function (file) {
         return $http({
         method: 'POST',
         url: fileService.UploadUrl,
         data:file
         }).then(function(response)
         {
         return response;
         });

         }*/
    };

    app.controller("snapUploadController", snapUploadController);
}());