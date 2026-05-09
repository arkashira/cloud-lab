import pytest

from src.team import Team
from src.access_control import AccessControl


def test_basic_access_grants():
    dev_team = Team(name="dev")
    dev_team.add_member("alice")
    dev_team.add_member("bob")

    prod_team = Team(name="prod")
    prod_team.add_member("carol")

    ac = AccessControl()
    ac.assign_team("dev-env", dev_team)
    ac.assign_team("prod-env", prod_team)

    assert ac.can_access("alice", "dev-env")
    assert ac.can_access("bob", "dev-env")
    assert not ac.can_access("carol", "dev-env")

    assert ac.can_access("carol", "prod-env")
    assert not ac.can_access("alice", "prod-env")


def test_unassigned_environment_denies_access():
    ac = AccessControl()
    assert not ac.can_access("anyone", "unassigned-env")


def test_revoking_team_removes_access():
    team = Team(name="team")
    team.add_member("dave")
    ac = AccessControl()
    ac.assign_team("env", team)
    assert ac.can_access("dave", "env")
    ac.revoke_team("env")
    assert not ac.can_access("dave", "env")