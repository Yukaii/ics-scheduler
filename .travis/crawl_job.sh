#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

if [ "$TRAVIS_BRANCH" != "data-updates" ]; then
    echo "on $TRAVIS_BRANCH branch, would not trigger crawler run"
    exit 0
fi

REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`
TARGET_BRANCH="data"

DATA_DIR='tmp'

mkdir $DATA_DIR
cd $DATA_DIR
git clone $REPO .
git checkout $TARGET_BRANCH || git checkout -b $TARGET_BRANCH origin/$TARGET_BRANCH
cd ..

for file in "./bin/*"
do
  org_code=`echo $file | sed 's/\.\/bin\///g'`

  if [ ! -f $DATA_DIR/$org_code.gz ] || test `find "$DATA_DIR/$org_code.gz" -mtime +3`
  then
    echo "$org_code data is old enough, run for updates"
    $file
    gzip < $.json > $DATA_DIR/$org_code.gz
  else
    echo "There is no need to run $org_code crawler"
  fi
done

cd $DATA_DIR

git config user.name "Travis Crawler Runner"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ -n "$(git status --porcelain)" ]; then
  echo "Will deploy a new version";
else
  echo "No changes to the output on this push; exiting."
  exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in ../.travis/travis_rsa.enc -out deploy_key -d
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH
