from flask import Flask, request, jsonify
from .log_manager import LogManager
from .ansible_executor import AnsibleExecutor
from .config import S3_BUCKET_NAME

app = Flask(__name__)

@app.route('/execute_playbook', methods=['POST'])
def execute_playbook():
    if 'playbook' not in request.files:
        return jsonify({'error': 'No playbook file provided'}), 400

    playbook_file = request.files['playbook']
    playbook_path = '/tmp/' + playbook_file.filename
    playbook_file.save(playbook_path)

    log_manager = LogManager()
    log_upload_success = log_manager.upload_to_s3(playbook_path)

    if not log_upload_success:
        return jsonify({'error': 'Failed to upload playbook to S3'}), 500

    executor = AnsibleExecutor(playbook_path)
    output = executor.run_playbook()

    # Clean up the temporary playbook file
    os.remove(playbook_path)

    return jsonify({'output': output}), 200

if __name__ == '__main__':
    app.run(debug=True)