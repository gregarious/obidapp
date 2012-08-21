from fabric.api import local, run, lcd, cd, env

env.hosts = ['scenable']
env.use_ssh_config = True

'''
contents of optimize.sh:
./node_modules/requirejs/bin/r.js -o
    name=main
    out=www-build/js/main.js
    baseUrl=../www/js
    paths.templates=../templates
'''


def build_local():
    with lcd('deploy'):
        local('./optimize.sh')
        local('rsync -avz ../www/ www-build --exclude=js --exclude=.sass-cache')
        local('rsync -avz ../www/js/libs/ www-build/js/libs')


# TODO: directly use the doc_root in place of www-build
def deploy_webapp():
    webapp_source_root = 'src/obidapp'
    webapp_doc_root = '$HOME/webapps/scenable_webapp'
    with cd(webapp_source_root):
        #run('git checkout master')
        #run('git pull')
        with cd('deploy'):
            run('./optimize.sh')
            run('rsync -avz ../www/ www-build --exclude=js --exclude=.sass-cache')
            run('rsync -avz ../www/js/libs/ www-build/js/libs')
            webapp_doc_root = '../../../webapps/scenable_webapp'
            run('rsync -avz --delete www-build/ ' + webapp_doc_root)
