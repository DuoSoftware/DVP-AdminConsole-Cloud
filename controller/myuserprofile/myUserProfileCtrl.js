/**
 * Created by dinusha on 6/11/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var myUserProfileCtrl = function ($scope, $stateParams, $filter, myUserProfileApiAccess, sipUserApiHandler, loginService,$anchorScroll) {

        $anchorScroll();
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

        $scope.selectedSipUser = {};

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

        $scope.saveProfile = function () {

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
            myUserProfileApiAccess.updateMyProfile($scope.CurrentProfile).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'info', 'User profile updated successfully');

                    if (curUser) {
                        curUser.GuRefId = $scope.CurrentProfile._id;
                        sipUserApiHandler.updateUser(curUser);
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

        }

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


        var loadProfile = function (username) {
            myUserProfileApiAccess.getMyProfile().then(function (data) {
                if (data.IsSuccess) {
                    $scope.CurrentProfile = data.Result;

                    if (data.Result) {
                        if (data.Result.address) {
                            $scope.displayAddress = data.Result.address.city + ' , ' + data.Result.address.province + ' , ' + data.Result.address.country;
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

                        if (!data.Result.avatar) {
                            $scope.CurrentProfile.avatar = 'assets/images/noimage.jpg';
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
            myUserProfileApiAccess.addContactToMyProfile($scope.newContact.Contact, $scope.newContact.Type).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'info', 'Contact added');

                    myUserProfileApiAccess.getMyProfile().then(function (data1) {
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
            myUserProfileApiAccess.deleteContactFromMyProfile(contact).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'info', 'Contact added');

                    myUserProfileApiAccess.getMyProfile().then(function (data1) {
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

    };

    app.controller("myUserProfileCtrl", myUserProfileCtrl);
}());
