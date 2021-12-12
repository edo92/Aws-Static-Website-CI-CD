# Aws Static Website CI/CD

  <p align="center">
    <img src="https://raw.githubusercontent.com/edo92/Aws-Static-Website-CI-CD/docs/.assets/diagram.png?token=AH5SSOLMOUMLFXOAWH4WBS3BX25T2"/>
  </p>

<br/>
<br/>

Static website hosting infrastructure on AWS by CDK. Deploys react source code to S3, serves website with low latency content delivery network with an origin access identity and Lambda@Edge. Secured by HTTPS (SSL/TLS) with certificate manager(ACM), and attaches it to the CloudFront distribution. Also secures cloudFront distribution with web application firewall (WAF) from common web-based attacks. This solution also includes two pipelines, one for cdk code infrastructue, and one for react codebase.

![example workflow](https://github.com/edo92/Aws-Static-Website-CI-CD/actions/workflows/main.yml/badge.svg)

</br>

### 📜 &nbsp; Github Oauth Token

> #### <i class="fa fa-gear fa-spin fa-2x" style="color: firebrick"></i> **_Create secret manager for github token_**

```sh
   aws secretsmanager create-secret --name demoapp/gitSourcetoken --secret-string <GITHUB_TOKEN>
```

> Or

```sh
   aws secretsmanager update-secret --secret-id demoapp/gitSourcetoken --secret-string <GITHUB_TOKEN>
```

</br>

### :key: &nbsp; Aws Credentials

> #### <i class="fa fa-gear fa-spin fa-2x" style="color: firebrick"></i> **_Export local environmental variables_**

```sh
   export AWS_ACCESS_KEY_ID=<XXXX>
   export AWS_SECRET_ACCESS_KEY=<XXXX>
   export AWS_DEFAULT_REGION=<XXXX>
```

</br>

### ⚙️ &nbsp; Configuration

> #### <i class="fa fa-gear fa-spin fa-2x" style="color: firebrick"></i> **_Configure credentials in config.json_**

```json
    "settings": {
      "locations": ["US"],
      "region": "<Region for distribution>",
      "domainName": "<Url link route53>",
      "hostedZoneId": "<Host zone id form route53>"
    },

    // React app source code
   "project_source": {
      "branch": "main",
      "owner": "<OWNER>",
      "repo": "<REPO>",
      "secretToken": "<setup in next step>",
    },

    // Cdk infrastructure code
   "cdk_source": {
      "branch": "main",
      "owner": "<OWNER>",
      "repo": "<REPO>",
      "secretToken": "<setup in next step>",
    }
```

</br>

### 🔨 &nbsp; Get Started

-  Install

```js
   npm install
```

-  deploy

```js
   cdk deploy
```

</br>

---

### :exclamation: &nbsp; Issues

#### Initial deployment

> :warning: &nbsp; **On Initial Deployment**: Cdk pipeline will fail to prevent repeate deployment

</br>

#### Import alias path not found

```sh
   alias cdk="npx aws-cdk"
```

</br>

#### Distribution deletion stuck in progress

```sh
   aws cloudfront get-distribution-config --id ${id} | jq '. | .DistributionConfig' > /tmp/disable-distribution-${id}
```

> Or

```sh
   aws cloudfront delete-distribution --id ${id} --if-match \
   $(aws cloudfront get-distribution-config --id ${id} | jq .ETag -r)
```
