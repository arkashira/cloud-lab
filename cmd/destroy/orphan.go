package destroy

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

// FileOrphanChecker implements OrphanChecker by reading a JSON state file.
type FileOrphanChecker struct {
	// StatePath points to a JSON file that records all provisioned resources.
	// The file must contain an array of objects with fields:
	//   id (string), type (string), attached (bool)
	StatePath string
}

// NewFileOrphanChecker creates a FileOrphanChecker for the given state file.
func NewFileOrphanChecker(statePath string) *FileOrphanChecker {
	return &FileOrphanChecker{StatePath: statePath}
}

// FindOrphans reads the state file and returns any resources whose
// `attached` flag is false, indicating they are orphaned.
func (f *FileOrphanChecker) FindOrphans() ([]Resource, error) {
	file, err := os.Open(f.StatePath)
	if err != nil {
		if os.IsNotExist(err) {
			// No state file → no resources, thus no orphans.
			return nil, nil
		}
		return nil, err
	}
	defer file.Close()

	data, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	// Internal representation matching the persisted JSON.
	var all []struct {
		ID       string `json:"id"`
		Type     string `json:"type"`
		Attached bool   `json:"attached"`
	}
	if err := json.Unmarshal(data, &all); err != nil {
		return nil, err
	}

	var orphans []Resource
	for _, r := range all {
		if !r.Attached {
			orphans = append(orphans, Resource{ID: r.ID, Type: r.Type})
		}
	}
	return orphans, nil
}