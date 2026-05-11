from flask import Blueprint, request, jsonify
from validators.distribution import DistributionValidator
from models.distribution import Distribution

bp = Blueprint('distributions', __name__)

@bp.route('/distributions', methods=['POST'])
def create_distribution():
    """
    POST /distributions
    Expected JSON:
        {
            "name": "my‑dist",
            "domain": "example.com"
        }
    """
    data = request.get_json(silent=True) or {}

    # 1️⃣ Validate input
    validator = DistributionValidator(data)
    errors = validator.validate()
    if errors:
        return jsonify({"errors": errors}), 400

    # 2️⃣ Persist (currently in‑memory)
    dist = Distribution.create(name=data['name'], domain=data['domain'])

    # 3️⃣ Return success payload
    return (
        jsonify({
            "message": "Distribution created successfully",
            "distribution": asdict(dist)
        }),
        201,
        {"Location": f"/distributions/{dist.name}"}
    )