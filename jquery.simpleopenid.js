(function($)
{
	// Bases on a script written by Steve Fenton
	// http://www.stevefenton.co.uk/Content/Jquery-Simple-Openid/
	//
	// Modified by Vojtech Jasny <voy@voy.cz>
	//
	// Feel free to use this jQuery Plugin
	// Version: 1.1.0

	$.fn.simpleopenid = function (settings) {

		var config = {
			classmodifier: "oid",
			baseaddress: "",
			providers: null
		};

		if (settings) {
			$.extend(config, settings);
		}

		// ["Name", "Image", "Uri", "Requires User Name"]
		var providers = {
			"google":       ["Google", "openid/google.png", "https://www.google.com/accounts/o8/id", false],
			"google_apps":  ["Google Apps", "openid/google.png", "https://www.google.com/a/{0}/o8/ud?be=o8", true],
			"yahoo":        ["Yahoo", "openid/yahoo.png", "http://yahoo.com/", false],
			"aol":          ["AOL", "openid/aol.png", "http://openid.aol.com/{0}", true],
			"myopenid":   ["My Open Id", "openid/myopenid.png", "http://{0}.myopenid.com/", true],
			"flickr":       ["Flickr", "openid/flickr.png", "http://flickr.com/{0}/", true],
			"myspace":      ["Myspace", "openid/myspace.png", "http://www.myspace.com/{0}", true],
			"technorati":   ["Technorati", "openid/technorati.png", "http://technorati.com/people/technorati/{0}/", true],
			"wordpress":    ["Wordpress", "openid/wordpress.png", "http://{0}.wordpress.com", true],
			"blogspot":     ["Blogspot", "openid/blogspot.png", "http://{0}.blogspot.com/", true],
			"live_journal": ["Live Journal", "openid/livejournal.png", "http://{0}.livejournal.com", true],
			"claimid":      ["ClaimID", "openid/claimid.png", "http://claimid.com/{0}", true],
			"vidoop":       ["Vidoop", "openid/vidoop.png", "http://{0}.myvidoop.com/", true],
			"verisign":     ["Verisign", "openid/verisign.png", "http://{0}.pip.verisignlabs.com/", true],
		}

		var userProviders = {};
		if (config.providers) {
			$.each(config.providers, function(i, value) {
				userProviders[value] = providers[value];
			});
		} else {
			userProviders = providers;
		}

		return this.each(function () {
			var $Element = $(this),
			    providerList = $("<ul>");

			$.each(userProviders, function(i, provider) {
				providerList.append($("<li>", {
					html: $("<img>", {
						src: config.baseaddress,
						alt: provider[0],
						title: provider[0],
						'class': config.classmodifier,
						css: { cursor: 'pointer' },
						data: { provider: provider }
					})
				}));
			});

			$Element.prepend(providerList);

			$Element.submit(function () {
				var uri = $(this).find("#openid_identifier").val();
				if (uri.indexOf("{0}") > -1) {
					$(this).find("#openid_identifier").val(uri.replace("{0}", $(this).find("#openid_username").val()));
				}
			});

			// Handle the selection click
			$Element.find("img." + config.classmodifier).click(function () {

				var provider = $(this).data("provider"),
				    title = provider[0],
				    image = provider[1],
				    uri = provider[2],
				    hasUser = provider[3];

				$("img.selected").removeClass("selected");
				$(this).addClass("selected");

				if (hasUser) {
					// User name required
					$Element.find("fieldset").eq(0).show();
					$Element.find("fieldset").eq(1).hide();

					$("span." + config.classmodifier).remove();

					var $UserName = $Element.find("#openid_username");
					var uriParts = uri.split("{0}");

					// Surround the input with the URL
					if (uriParts.length > 1) {
						$UserName.before('<span class="' + config.classmodifier + '">' + uriParts[0] + '</span>');
						$UserName.after('<span class="' + config.classmodifier + '">' + uriParts[1] + '</span>');
					} else {
						$UserName.before('<span class="' + config.classmodifier + '">' + uriParts[0] + '</span>');
					}

					$Element.find("#openid_identifier").val(uri);
				} else {
					// No user name required
					$Element.find("fieldset").eq(0).hide();
					$Element.find("fieldset").eq(1).show();
					$Element.find("#openid_identifier").val(uri);
					$Element[0].submit();
				}

			});

		});
	};
})(jQuery);
