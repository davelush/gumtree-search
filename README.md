# Gumtree Search
Gives me some search functionality that doesn't exist in Gumtree. E.g. blacklist terms

This template is a production ready boilerplate for developing with `PuppeteerCrawler`.
Use this to bootstrap your projects using the most up-to-date code.

If you're looking for examples or want to learn more visit:
- [Documentation](https://sdk.apify.com/docs/api/puppeteer-crawler) 
- [Examples](https://sdk.apify.com/docs/examples/puppeteer-crawler) 

# Getting Started

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash 
nvm install 12
```

## Cookie Keys

This is pretty much guess work and inference based on watching how the site is behaving

| Cookie Key   | Example                                                                         | Purpose                                                                                                 |
|--------------|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| gt_ab        | ln:8zdsh                                                                        | Probably for A/B testing cohorts. If we base64 decode this we get "ln:8zdsh"                            |
| gt_p         | id:78cfe378-b06e-43ad-88cb-0bdf6cf90e91                                         | base64 encoded UUID                                                                                     |
| gt_s         | sc:nn\|clicksource_featured:nn\|ar:nn\|st:nn\|clicksource_natural               | Contains a set of pipe delimited values. Not sure what for                                              |
| gt_userPref  | isSearchOpen:nn\|recentAdsOne:nn\|cookiePolicy:nn\|recentAdsTwo:nn\|location:nn | Contains a set of pipe delimited values with preferences                                                |
| gt_appBanner | empty                                                                           | Not sure                                                                                                |
| gt_adconsent | empty                                                                           | Not sure                                                                                                |
| gt_userIntr  | cnt:5                                                                           | Not sure what this is counting. It does align with the number of successful pages before bombing though |
| GCLB         |                                                                                 | Google Cloud Load Balancer. Probably an ID for sticky sessions                                          | 

## Documentation reference

- [Apify SDK](https://sdk.apify.com/)
- [Apify Actor documentation](https://docs.apify.com/actor)
- [Apify CLI](https://docs.apify.com/cli)
