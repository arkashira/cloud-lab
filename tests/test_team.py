import pytest

from src.team import Team


def test_add_and_remove_members():
    team = Team(name="infra")
    team.add_member("alice")
    team.add_member("bob")
    assert team.has_member("alice")
    assert team.has_member("bob")
    assert not team.has_member("carol")

    team.remove_member("bob")
    assert not team.has_member("bob")
    # Removing a non‑existent member should be a no‑op, not raise.
    team.remove_member("nonexistent")


def test_list_members_is_isolated_copy():
    team = Team(name="ops")
    team.add_member("dave")
    members = team.list_members()
    members.add("eve")  # mutate the returned set
    # Original team should be unchanged.
    assert not team.has_member("eve")
    assert team.has_member("dave")